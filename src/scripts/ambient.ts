// Generative "late-night coding" ambience built with the Web Audio API.
// Nothing is downloaded: chords, plucks, keyboard clicks, and hiss are synthesized live.

type Chord = { bass: number; notes: number[] };

// Fmaj9, Em7, Dm9, Cmaj9 (MIDI note numbers)
const PROGRESSION: Chord[] = [
  { bass: 41, notes: [57, 60, 64, 67] },
  { bass: 40, notes: [55, 59, 62, 64] },
  { bass: 38, notes: [53, 57, 60, 64] },
  { bass: 36, notes: [52, 55, 59, 62] },
];
const PENTATONIC = [72, 74, 76, 79, 81, 84];

// Each theme nudges the key and brightness so the music matches the look
const THEME_SOUND: Record<string, { shift: number; cutoff: number }> = {
  plum: { shift: 0, cutoff: 1100 },
  forest: { shift: -2, cutoff: 1000 },
  linen: { shift: 2, cutoff: 1600 },
  graphite: { shift: -3, cutoff: 900 },
  sky: { shift: 4, cutoff: 1900 },
  terminal: { shift: -5, cutoff: 1300 },
  paper: { shift: 2, cutoff: 1500 },
  midnight: { shift: -1, cutoff: 1200 },
  ember: { shift: -4, cutoff: 1000 },
};

const BPM = 70;
const EIGHTH = 60 / BPM / 2;
const STEPS_PER_CHORD = 16;
const LOOKAHEAD = 0.3;
const MAX_GAIN = 0.55;

const hz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);
const rand = (a: number, b: number) => a + Math.random() * (b - a);

class Ambient {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private padFilter!: BiquadFilterNode;
  private padBus!: GainNode;
  private delaySend!: GainNode;
  private noise!: AudioBuffer;
  private hiss: AudioBufferSourceNode | null = null;
  private timer: number | null = null;

  private step = 0;
  private nextStepTime = 0;
  private nextKeyTime = 0;
  private keysLeft = 0;
  private shift = 0;

  playing = false;
  volume = 0.6;

  private build() {
    const ctx = new AudioContext();
    this.ctx = ctx;

    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.ratio.value = 3;
    comp.connect(ctx.destination);

    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(comp);

    this.padFilter = ctx.createBiquadFilter();
    this.padFilter.type = "lowpass";
    this.padFilter.frequency.value = 1100;
    this.padFilter.Q.value = 0.4;
    this.padFilter.connect(this.master);

    this.padBus = ctx.createGain();
    this.padBus.gain.value = 1;
    this.padBus.connect(this.padFilter);

    // Soft echo for the plucks
    const delay = ctx.createDelay(2);
    delay.delayTime.value = EIGHTH * 3;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.35;
    const wet = ctx.createGain();
    wet.gain.value = 0.35;
    delay.connect(feedback).connect(delay);
    delay.connect(wet).connect(this.padFilter);
    this.delaySend = ctx.createGain();
    this.delaySend.connect(delay);

    // One second of white noise, reused for typing clicks and hiss
    this.noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = this.noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

    document.addEventListener("visibilitychange", () => {
      if (!this.ctx || !this.playing) return;
      if (document.hidden) this.ctx.suspend();
      else this.ctx.resume();
    });
  }

  setTheme(id: string) {
    const s = THEME_SOUND[id] ?? THEME_SOUND.plum;
    this.shift = s.shift;
    if (this.ctx) this.padFilter.frequency.setTargetAtTime(s.cutoff, this.ctx.currentTime, 1.5);
  }

  setVolume(v: number) {
    this.volume = v;
    if (this.ctx && this.playing) {
      this.master.gain.setTargetAtTime(v * MAX_GAIN, this.ctx.currentTime, 0.08);
    }
  }

  async start() {
    if (!this.ctx) this.build();
    const ctx = this.ctx!;
    await ctx.resume();
    this.playing = true;

    const now = ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(this.volume * MAX_GAIN, now + 2.5);

    this.step = 0;
    this.nextStepTime = now + 0.1;
    this.nextKeyTime = now + rand(1.5, 3);
    this.startHiss();
    if (this.timer === null) this.timer = window.setInterval(() => this.schedule(), 60);
  }

  stop() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    this.playing = false;
    const now = ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(0, now + 1.2);
    window.setTimeout(() => {
      if (this.playing) return;
      if (this.timer !== null) clearInterval(this.timer);
      this.timer = null;
      this.hiss?.stop();
      this.hiss = null;
      ctx.suspend();
    }, 1300);
  }

  private schedule() {
    const ctx = this.ctx!;
    const horizon = ctx.currentTime + LOOKAHEAD;

    while (this.nextStepTime < horizon) {
      const t = this.nextStepTime;
      const pos = this.step % STEPS_PER_CHORD;
      const chord = PROGRESSION[Math.floor(this.step / STEPS_PER_CHORD) % PROGRESSION.length];

      if (pos === 0) this.pad(chord, t, STEPS_PER_CHORD * EIGHTH);
      if (pos === 0 || pos === 10) this.bass(chord.bass, t);
      if (pos % 2 === 0 && Math.random() < 0.3) this.pluck(PENTATONIC[(Math.random() * PENTATONIC.length) | 0], t);

      this.step++;
      this.nextStepTime += EIGHTH;
    }

    while (this.nextKeyTime < horizon) {
      const t = this.nextKeyTime;
      if (this.keysLeft <= 0) {
        this.keysLeft = (rand(6, 22)) | 0;
      }
      const space = Math.random() < 0.15;
      this.key(t, space);
      this.keysLeft--;
      this.nextKeyTime += this.keysLeft > 0 ? rand(0.07, 0.19) : rand(2.5, 7);
    }
  }

  private pad(chord: Chord, t: number, length: number) {
    const ctx = this.ctx!;
    const release = 2.5;
    for (const note of chord.notes) {
      const f = hz(note + this.shift);
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(0.05, t + 1.6);
      env.gain.setValueAtTime(0.05, t + length - 0.2);
      env.gain.exponentialRampToValueAtTime(0.0001, t + length + release);
      env.connect(this.padBus);
      for (const [type, cents] of [["triangle", -7], ["sine", 7]] as const) {
        const osc = ctx.createOscillator();
        osc.type = type;
        osc.frequency.value = f;
        osc.detune.value = cents;
        osc.connect(env);
        osc.start(t);
        osc.stop(t + length + release + 0.1);
      }
    }
  }

  private bass(note: number, t: number) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = hz(note + this.shift);
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(0.16, t + 0.04);
    env.gain.exponentialRampToValueAtTime(0.0001, t + 2.8);
    osc.connect(env).connect(this.padFilter);
    osc.start(t);
    osc.stop(t + 3);
  }

  private pluck(note: number, t: number) {
    const ctx = this.ctx!;
    const f = hz(note + this.shift);
    const env = ctx.createGain();
    const peak = rand(0.025, 0.05);
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(peak, t + 0.008);
    env.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
    env.connect(this.padBus);
    env.connect(this.delaySend);
    for (const [mult, amp] of [[1, 1], [2, 0.25], [3, 0.08]]) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = f * mult;
      const g = ctx.createGain();
      g.gain.value = amp;
      osc.connect(g).connect(env);
      osc.start(t);
      osc.stop(t + 1.7);
    }
  }

  private key(t: number, space: boolean) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = space ? rand(500, 800) : rand(1800, 4200);
    band.Q.value = space ? 2 : 1.4;
    const env = ctx.createGain();
    const len = space ? 0.07 : rand(0.018, 0.035);
    const peak = space ? 0.12 : rand(0.05, 0.1);
    env.gain.setValueAtTime(peak, t);
    env.gain.exponentialRampToValueAtTime(0.0001, t + len);
    src.connect(band).connect(env).connect(this.master);
    src.start(t, Math.random() * 0.9, len + 0.02);
  }

  private startHiss() {
    if (this.hiss) return;
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 3500;
    const g = ctx.createGain();
    g.gain.value = 0.012;
    src.connect(hp).connect(g).connect(this.master);
    src.start();
    this.hiss = src;
  }
}

export const ambient = new Ambient();
