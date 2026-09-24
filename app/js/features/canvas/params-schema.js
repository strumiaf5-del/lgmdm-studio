/* ============================================================
   params-schema.js — Definición canónica de TODOS los parámetros
   ============================================================
   Single responsibility: describe QUÉ params hay (no CÓMO se
   renderizan). Cualquier cambio aquí se refleja automáticamente
   en el UI.

   Estructura de cada param:
     - key:    nombre del campo en MasteringParams (backend)
     - label:  texto visible al usuario
     - type:   'range' | 'checkbox' | 'select'
     - min/max/step: para range
     - options: para select [{value, label}]
     - default: valor por defecto
     - unit:   texto unidad (dB, Hz, ms, etc.)
*/

const RANGE = (key, label, min, max, step, def, unit = '') =>
  ({ key, label, type: 'range', min, max, step, default: def, unit });
const CHECK = (key, label, def) =>
  ({ key, label, type: 'checkbox', default: def });
const SELECT = (key, label, options, def) =>
  ({ key, label, type: 'select', options, default: def });

export const PARAMS_SCHEMA = [

  /* ── Gain & Loudness ───────────────────────────────────── */
  { id: 'gain', title: 'Gain & Loudness', params: [
    RANGE('input_gain_db', 'Input Gain', -24, 24, 0.1, 0, 'dB'),
    RANGE('target_peak', 'Target Peak', 0.5, 1.0, 0.01, 0.95),
    RANGE('target_lufs', 'Target LUFS', -30, -6, 0.1, -14, 'LUFS'),
    CHECK('use_lufs_normalize', 'Use LUFS Normalize', false),
  ]},

  /* ── Filters ────────────────────────────────────────────── */
  { id: 'filter', title: 'HP / LP Filter', params: [
    RANGE('hp_cutoff', 'HP Cutoff', 10, 200, 1, 20, 'Hz'),
    RANGE('lp_cutoff', 'LP Cutoff', 2000, 22000, 100, 18000, 'Hz'),
    CHECK('lp_bypass', 'LP Bypass', true),
    SELECT('oversample_mode', 'Oversample Mode', [
      { value: 'eco', label: 'Eco' },
      { value: 'quality', label: 'Quality' },
      { value: 'extreme', label: 'Extreme' },
    ], 'quality'),
  ]},

  /* ── EQ Parametric (6 bandas) ───────────────────────────── */
  { id: 'eq-1', title: 'EQ Band 1', params: [
    RANGE('eq1_freq', 'Frequency', 20, 20000, 1, 100, 'Hz'),
    RANGE('eq1_gain', 'Gain', -12, 12, 0.1, 0, 'dB'),
    RANGE('eq1_q', 'Q', 0.1, 10, 0.1, 1.0),
  ]},
  { id: 'eq-2', title: 'EQ Band 2', params: [
    RANGE('eq2_freq', 'Frequency', 20, 20000, 1, 500, 'Hz'),
    RANGE('eq2_gain', 'Gain', -12, 12, 0.1, 0, 'dB'),
    RANGE('eq2_q', 'Q', 0.1, 10, 0.1, 1.0),
  ]},
  { id: 'eq-3', title: 'EQ Band 3', params: [
    RANGE('eq3_freq', 'Frequency', 20, 20000, 1, 2000, 'Hz'),
    RANGE('eq3_gain', 'Gain', -12, 12, 0.1, 0, 'dB'),
    RANGE('eq3_q', 'Q', 0.1, 10, 0.1, 1.0),
  ]},
  { id: 'eq-4', title: 'EQ Band 4', params: [
    RANGE('eq4_freq', 'Frequency', 20, 20000, 1, 8000, 'Hz'),
    RANGE('eq4_gain', 'Gain', -12, 12, 0.1, 0, 'dB'),
    RANGE('eq4_q', 'Q', 0.1, 10, 0.1, 1.0),
  ]},
  { id: 'eq-5', title: 'EQ Band 5', params: [
    RANGE('eq5_freq', 'Frequency', 20, 20000, 1, 200, 'Hz'),
    RANGE('eq5_gain', 'Gain', -12, 12, 0.1, 0, 'dB'),
    RANGE('eq5_q', 'Q', 0.1, 10, 0.1, 1.0),
  ]},
  { id: 'eq-6', title: 'EQ Band 6', params: [
    RANGE('eq6_freq', 'Frequency', 20, 20000, 1, 1000, 'Hz'),
    RANGE('eq6_gain', 'Gain', -12, 12, 0.1, 0, 'dB'),
    RANGE('eq6_q', 'Q', 0.1, 10, 0.1, 1.0),
  ]},

  /* ── EQ Shelves ────────────────────────────────────────── */
  { id: 'eq-shelves', title: 'EQ Shelves', params: [
    SELECT('eq_mode', 'EQ Mode', [
      { value: 'iir', label: 'IIR (faster)' },
      { value: 'linear', label: 'Linear Phase' },
    ], 'iir'),
    RANGE('linear_phase_taps', 'Linear Phase Taps', 257, 8193, 256, 2049),
    RANGE('high_shelf_gain_db', 'High Shelf Gain', -12, 12, 0.1, 0, 'dB'),
    RANGE('high_shelf_freq_hz', 'High Shelf Freq', 1000, 16000, 100, 8000, 'Hz'),
    RANGE('low_shelf_gain_db', 'Low Shelf Gain', -12, 12, 0.1, 0, 'dB'),
    RANGE('low_shelf_freq_hz', 'Low Shelf Freq', 20, 500, 5, 100, 'Hz'),
  ]},

  /* ── Tonal Balance (auto-EQ sin ref) ────────────────────── */
  { id: 'tonal', title: 'Tonal Balance (Auto EQ)', params: [
    CHECK('tonal_balance_bypass', 'Bypass', true),
    RANGE('tonal_balance_amount', 'Amount', 0, 1, 0.01, 1.0),
    RANGE('tonal_balance_max_boost_db', 'Max Boost', 0, 12, 0.1, 3.5, 'dB'),
    RANGE('tonal_balance_max_cut_db', 'Max Cut', -12, 0, 0.1, -4.5, 'dB'),
    RANGE('tonal_balance_max_bands', 'Max Bands', 1, 10, 1, 6),
  ]},

  /* ── MS EQ ──────────────────────────────────────────────── */
  { id: 'ms-eq', title: 'Mid/Side EQ', params: [
    CHECK('ms_eq_bypass', 'Bypass', true),
    RANGE('ms_mid_freq', 'Mid Freq', 20, 5000, 10, 250, 'Hz'),
    RANGE('ms_mid_gain', 'Mid Gain', -12, 12, 0.1, 0, 'dB'),
    RANGE('ms_mid_q', 'Mid Q', 0.1, 10, 0.1, 1.0),
    RANGE('ms_side_freq', 'Side Freq', 1000, 16000, 100, 8000, 'Hz'),
    RANGE('ms_side_gain', 'Side Gain', -12, 12, 0.1, 0, 'dB'),
    RANGE('ms_side_q', 'Side Q', 0.1, 10, 0.1, 1.0),
  ]},

  /* ── MS Comp ────────────────────────────────────────────── */
  { id: 'ms-comp', title: 'Mid/Side Compressor', params: [
    CHECK('ms_comp_bypass', 'Bypass', true),
    CHECK('ms_comp_pdr', 'Program-Dependent Release', true),
    RANGE('ms_comp_pdr_hold_ms', 'PDR Hold', 50, 2000, 10, 500, 'ms'),
    RANGE('ms_comp_mid_threshold_db', 'Mid Threshold', -40, 0, 0.1, -18, 'dB'),
    RANGE('ms_comp_mid_ratio', 'Mid Ratio', 1, 20, 0.1, 2.0),
    RANGE('ms_comp_mid_attack_ms', 'Mid Attack', 0.1, 200, 0.1, 15, 'ms'),
    RANGE('ms_comp_mid_release_ms', 'Mid Release', 10, 2000, 10, 120, 'ms'),
    RANGE('ms_comp_mid_makeup_db', 'Mid Makeup', 0, 12, 0.1, 0, 'dB'),
    RANGE('ms_comp_side_threshold_db', 'Side Threshold', -40, 0, 0.1, -18, 'dB'),
    RANGE('ms_comp_side_ratio', 'Side Ratio', 1, 20, 0.1, 2.0),
    RANGE('ms_comp_side_attack_ms', 'Side Attack', 0.1, 200, 0.1, 15, 'ms'),
    RANGE('ms_comp_side_release_ms', 'Side Release', 10, 2000, 10, 120, 'ms'),
    RANGE('ms_comp_side_makeup_db', 'Side Makeup', 0, 12, 0.1, 0, 'dB'),
  ]},

  /* ── Dynamic EQ (Resonance control) ─────────────────────── */
  { id: 'reso', title: 'Dynamic EQ (Resonance)', params: [
    CHECK('reso_bypass', 'Bypass', true),
    RANGE('reso_freq', 'Frequency', 20, 20000, 10, 1200, 'Hz'),
    RANGE('reso_q', 'Q', 0.1, 10, 0.1, 3.0),
    RANGE('reso_threshold_db', 'Threshold', -40, 0, 0.1, -18, 'dB'),
    RANGE('reso_ratio', 'Ratio', 1, 20, 0.1, 3.0),
    RANGE('reso_attack_ms', 'Attack', 0.1, 200, 0.1, 5, 'ms'),
    RANGE('reso_release_ms', 'Release', 10, 2000, 10, 100, 'ms'),
    RANGE('reso_max_reduction_db', 'Max Reduction', 0, 24, 0.1, 8, 'dB'),
  ]},

  /* ── De-esser ──────────────────────────────────────────── */
  { id: 'deess', title: 'De-esser', params: [
    CHECK('dyneq_bypass', 'Bypass', true),
    RANGE('dyneq_freq', 'Frequency', 1000, 16000, 100, 3000, 'Hz'),
    RANGE('dyneq_q', 'Q', 0.1, 10, 0.1, 2.5),
    RANGE('dyneq_threshold_db', 'Threshold', -40, 0, 0.1, -18, 'dB'),
    RANGE('dyneq_ratio', 'Ratio', 1, 20, 0.1, 3.0),
    RANGE('dyneq_attack_ms', 'Attack', 0.1, 200, 0.1, 3, 'ms'),
    RANGE('dyneq_release_ms', 'Release', 10, 2000, 10, 80, 'ms'),
    RANGE('dyneq_max_reduction_db', 'Max Reduction', 0, 24, 0.1, 12, 'dB'),
  ]},

  /* ── Transient Shaper ──────────────────────────────────── */
  { id: 'transient', title: 'Transient Shaper', params: [
    RANGE('transient_attack', 'Attack', -12, 12, 0.1, 0, 'dB'),
    RANGE('transient_sustain', 'Sustain', -12, 12, 0.1, 0, 'dB'),
  ]},

  /* ── Multiband Compressor ───────────────────────────────── */
  { id: 'mb-low', title: 'Multiband Comp — Low', params: [
    CHECK('mb_bypass', 'MB Bypass (global)', true),
    RANGE('mb_low_crossover', 'Low Crossover', 50, 1000, 10, 250, 'Hz'),
    RANGE('mb_low_threshold_db', 'Threshold', -40, 0, 0.1, -18, 'dB'),
    RANGE('mb_low_ratio', 'Ratio', 1, 20, 0.1, 2.0),
    RANGE('mb_low_attack_ms', 'Attack', 0.1, 200, 0.1, 20, 'ms'),
    RANGE('mb_low_release_ms', 'Release', 10, 2000, 10, 150, 'ms'),
    RANGE('mb_low_makeup_db', 'Makeup', 0, 12, 0.1, 0, 'dB'),
  ]},
  { id: 'mb-mid', title: 'Multiband Comp — Mid', params: [
    RANGE('mb_high_crossover', 'High Crossover', 1000, 16000, 100, 4000, 'Hz'),
    RANGE('mb_mid_threshold_db', 'Threshold', -40, 0, 0.1, -18, 'dB'),
    RANGE('mb_mid_ratio', 'Ratio', 1, 20, 0.1, 2.0),
    RANGE('mb_mid_attack_ms', 'Attack', 0.1, 200, 0.1, 20, 'ms'),
    RANGE('mb_mid_release_ms', 'Release', 10, 2000, 10, 150, 'ms'),
    RANGE('mb_mid_makeup_db', 'Makeup', 0, 12, 0.1, 0, 'dB'),
  ]},
  { id: 'mb-high', title: 'Multiband Comp — High', params: [
    RANGE('mb_high_threshold_db', 'Threshold', -40, 0, 0.1, -18, 'dB'),
    RANGE('mb_high_ratio', 'Ratio', 1, 20, 0.1, 2.0),
    RANGE('mb_high_attack_ms', 'Attack', 0.1, 200, 0.1, 20, 'ms'),
    RANGE('mb_high_release_ms', 'Release', 10, 2000, 10, 150, 'ms'),
    RANGE('mb_high_makeup_db', 'Makeup', 0, 12, 0.1, 0, 'dB'),
    CHECK('mb_pdr', 'Program-Dependent Release', true),
    RANGE('mb_pdr_hold_ms', 'PDR Hold', 50, 2000, 10, 500, 'ms'),
  ]},

  /* ── Wideband Compressor ───────────────────────────────── */
  { id: 'comp', title: 'Compressor (Wideband)', params: [
    CHECK('comp_bypass', 'Bypass', true),
    CHECK('comp_stereo_link', 'Stereo Link', true),
    RANGE('comp_threshold_db', 'Threshold', -40, 0, 0.1, -18, 'dB'),
    RANGE('comp_ratio', 'Ratio', 1, 20, 0.1, 4.0),
    RANGE('comp_attack_ms', 'Attack', 0.1, 200, 0.1, 10, 'ms'),
    RANGE('comp_release_ms', 'Release', 10, 2000, 10, 100, 'ms'),
    RANGE('comp_makeup_db', 'Makeup', 0, 12, 0.1, 0, 'dB'),
    CHECK('comp_pdr', 'Program-Dependent Release', true),
    RANGE('comp_pdr_hold_ms', 'PDR Hold', 50, 2000, 10, 500, 'ms'),
  ]},

  /* ── Glue Compressor ───────────────────────────────────── */
  { id: 'glue', title: 'Glue Compressor', params: [
    CHECK('glue_bypass', 'Bypass', true),
    RANGE('glue_threshold_db', 'Threshold', -40, 0, 0.1, -4, 'dB'),
    RANGE('glue_ratio', 'Ratio', 1, 20, 0.1, 2.0),
    RANGE('glue_attack_ms', 'Attack', 0.1, 200, 0.1, 30, 'ms'),
    RANGE('glue_release_ms', 'Release', 10, 2000, 10, 120, 'ms'),
    RANGE('glue_makeup_db', 'Makeup', 0, 12, 0.1, 0, 'dB'),
    CHECK('glue_pdr', 'Program-Dependent Release', true),
    RANGE('glue_pdr_hold_ms', 'PDR Hold', 50, 2000, 10, 500, 'ms'),
  ]},

  /* ── Saturation ────────────────────────────────────────── */
  { id: 'saturation', title: 'Saturation', params: [
    RANGE('saturation_drive', 'Drive', 0, 1, 0.01, 0.0),
    RANGE('saturation_mix', 'Mix', 0, 1, 0.01, 0.0),
    SELECT('saturation_mode', 'Mode', [
      { value: 'tape', label: 'Tape' },
      { value: 'tube', label: 'Tube' },
      { value: 'analog', label: 'Analog' },
      { value: 'soft', label: 'Soft' },
    ], 'tape'),
  ]},

  /* ── Stereo Image ──────────────────────────────────────── */
  { id: 'stereo', title: 'Stereo Image', params: [
    CHECK('stereo_bypass', 'Bypass', false),
    RANGE('stereo_width_amount', 'Width', 0, 2, 0.01, 1.0),
    RANGE('mid_gain_db', 'Mid Gain', -12, 12, 0.1, 0, 'dB'),
    RANGE('side_gain_db', 'Side Gain', -12, 12, 0.1, 0, 'dB'),
    CHECK('use_stereo_enhancer', 'Use Stereo Enhancer', false),
    RANGE('enhancer_bass_mono_freq', 'Enhancer Bass Mono Freq', 20, 500, 5, 120, 'Hz'),
    RANGE('haas_delay_ms', 'Haas Delay', 0, 30, 0.1, 0, 'ms'),
    RANGE('low_end_mono_freq', 'Low End Mono Freq', 20, 500, 5, 120, 'Hz'),
    RANGE('low_end_mono_amount', 'Low End Mono Amount', 0, 1, 0.01, 0.0),
  ]},

  /* ── Multiband Stereo ───────────────────────────────────── */
  { id: 'mb-stereo', title: 'Multiband Stereo Width', params: [
    CHECK('mb_stereo_bypass', 'Bypass', true),
    RANGE('mb_stereo_low_crossover', 'Low Crossover', 50, 1000, 10, 150, 'Hz'),
    RANGE('mb_stereo_high_crossover', 'High Crossover', 1000, 16000, 100, 4000, 'Hz'),
    RANGE('mb_stereo_low_width', 'Low Width', 0, 2, 0.01, 0.9),
    RANGE('mb_stereo_mid_width', 'Mid Width', 0, 2, 0.01, 1.2),
    RANGE('mb_stereo_high_width', 'High Width', 0, 2, 0.01, 1.5),
  ]},

  /* ── Reverb ─────────────────────────────────────────────── */
  { id: 'reverb', title: 'Reverb', params: [
    RANGE('reverb_size', 'Size', 0, 1, 0.01, 0.05),
    RANGE('reverb_wet', 'Wet', 0, 1, 0.01, 0.0),
  ]},

  /* ── Parallel Compression ──────────────────────────────── */
  { id: 'parallel', title: 'Parallel Compression', params: [
    CHECK('parallel_bypass', 'Bypass', true),
    RANGE('parallel_threshold_db', 'Threshold', -40, 0, 0.1, -12, 'dB'),
    RANGE('parallel_ratio', 'Ratio', 1, 20, 0.1, 4.0),
    RANGE('parallel_attack_ms', 'Attack', 0.1, 200, 0.1, 10, 'ms'),
    RANGE('parallel_release_ms', 'Release', 10, 2000, 10, 100, 'ms'),
    RANGE('parallel_mix', 'Mix', 0, 1, 0.01, 0.0),
  ]},

  /* ── Clipper ────────────────────────────────────────────── */
  { id: 'clipper', title: 'Clipper', params: [
    CHECK('clipper_bypass', 'Bypass', true),
    SELECT('clipper_mode', 'Mode', [
      { value: 'soft', label: 'Soft (tanh)' },
      { value: 'hard', label: 'Hard' },
    ], 'soft'),
    RANGE('clipper_ceiling', 'Ceiling', 0.5, 1.0, 0.01, 0.98),
    RANGE('clipper_drive_db', 'Drive', 0, 12, 0.1, 0, 'dB'),
  ]},

  /* ── Limiter ───────────────────────────────────────────── */
  { id: 'limiter', title: 'Limiter', params: [
    CHECK('limiter_bypass', 'Bypass', false),
    RANGE('limiter_ceiling', 'Ceiling', 0.5, 1.0, 0.01, 0.95),
    RANGE('limiter_release_ms', 'Release', 10, 1000, 1, 80, 'ms'),
  ]},

  /* ── Noise Reduction ───────────────────────────────────── */
  { id: 'nr', title: 'Noise Reduction', params: [
    CHECK('nr_bypass', 'Bypass', true),
    RANGE('nr_strength', 'Strength', 0, 1, 0.01, 0.5),
    RANGE('nr_noise_sample_sec', 'Noise Sample', 0.1, 5, 0.1, 0.5, 's'),
  ]},

  /* ── Advanced DSP ──────────────────────────────────────── */
  { id: 'adv-tamer', title: 'Advanced — Tame', params: [
    CHECK('adv_tamer_bypass', 'Bypass', true),
    RANGE('adv_tamer_sensitivity', 'Sensitivity', 0, 1, 0.01, 0.5),
    RANGE('adv_tamer_depth_db', 'Depth', -24, 0, 0.1, -6, 'dB'),
    RANGE('adv_tamer_bands', 'Bands', 16, 256, 1, 64),
  ]},
  { id: 'adv-inflator', title: 'Advanced — Inflator', params: [
    CHECK('adv_inflator_bypass', 'Bypass', true),
    RANGE('adv_inflator_drive', 'Drive', 0, 1, 0.01, 0.5),
    RANGE('adv_inflator_mix', 'Mix', 0, 1, 0.01, 1.0),
    SELECT('adv_inflator_curve', 'Curve', [
      { value: 'chebyshev', label: 'Chebyshev' },
      { value: 'tanh', label: 'Tanh' },
      { value: 'sine', label: 'Sine' },
    ], 'chebyshev'),
  ]},
  { id: 'adv-phantom', title: 'Advanced — Phantom Sub', params: [
    CHECK('adv_phantom_sub_bypass', 'Bypass', true),
    RANGE('adv_phantom_sub_crossover', 'Crossover', 20, 200, 1, 80, 'Hz'),
    RANGE('adv_phantom_sub_mix', 'Mix', 0, 1, 0.01, 0.5),
    SELECT('adv_phantom_sub_mode', 'Mode', [
      { value: 'fifth', label: 'Fifth (most)' },
      { value: 'octave', label: 'Octave (clean)' },
    ], 'fifth'),
  ]},
  { id: 'adv-iso', title: 'Advanced — Iso', params: [
    CHECK('adv_iso_bypass', 'Bypass', true),
    RANGE('adv_iso_playback_phon', 'Playback Phon', 0, 100, 1, 40, 'phon'),
    RANGE('adv_iso_strength', 'Strength', 0, 1, 0.01, 0.5),
  ]},

];

/* ── Defaults (computed) ────────────────────────────────── */
export const DEFAULTS = {};
PARAMS_SCHEMA.forEach(s => s.params.forEach(p => { DEFAULTS[p.key] = p.default; }));
