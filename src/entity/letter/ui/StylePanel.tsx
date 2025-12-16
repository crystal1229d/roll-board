'use client';

import { NOTE_COLORS, PAPER_PATTERNS } from '@/entity/letter/config/paperStyles';
import { FONT_CATALOG } from '@/entity/letter/config/fonts';
import styles from './StylePanel.module.css';

type Props = {
  value: LetterStyleState;
  onChange: (patch: Partial<LetterStyleState>) => void;
};

export default function StylePanel({ value, onChange }: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.block}>
        <div className={styles.label}>Paper Color</div>
        <div className={styles.row}>
          {NOTE_COLORS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={[styles.swatch, value.noteColor === c.value ? styles.on : ''].join(' ')}
              style={{ background: c.value }}
              title={c.label}
              onClick={() => onChange({ noteColor: c.value })}
            />
          ))}
        </div>
      </div>

      <div className={styles.block}>
        <div className={styles.label}>Pattern</div>
        <select
          className={styles.select}
          value={value.pattern}
          onChange={(e) => onChange({ pattern: e.target.value as any })}
        >
          {PAPER_PATTERNS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.block}>
        <div className={styles.label}>Font</div>
        <select
          className={styles.select}
          value={value.fontFamily}
          onChange={(e) => onChange({ fontFamily: e.target.value as any })}
        >
          {FONT_CATALOG.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
