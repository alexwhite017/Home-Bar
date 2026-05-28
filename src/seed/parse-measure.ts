export type ParsedMeasure = {
  amount: number | null;
  unit: string | null;
  notation: string;
};

// Parses TheCocktailDB's free-text measure strings into structured fields.
// The notation column preserves a bartender-readable display string;
// amount/unit are the numeric parse for math (scaling, batching).
//
// cl measures are converted to oz using the bartender shorthand 3 cl ≈ 1 oz,
// then snapped to clean fractions for display. The original cl notation is
// rewritten to its oz equivalent so the UI shows oz everywhere.
//
// Examples:
//   "1 1/2 oz " → { amount: 1.5,  unit: "oz",   notation: "1 1/2 oz" }
//   "4.5 cl"    → { amount: 1.5,  unit: "oz",   notation: "1 1/2 oz" }
//   "1.5 cl"    → { amount: 0.5,  unit: "oz",   notation: "1/2 oz"   }
//   "1 dash"    → { amount: 1,    unit: "dash", notation: "1 dash"   }
//   null / ""   → { amount: null, unit: null,   notation: ""         }
export function parseMeasure(raw: string | null): ParsedMeasure {
  const notation = (raw ?? "").trim();
  if (!notation) return { amount: null, unit: null, notation: "" };

  let parsed: ParsedMeasure | null = null;

  // "1 1/2 oz" — whole + fraction + optional unit
  let m = notation.match(/^(\d+)\s+(\d+)\/(\d+)\s*(.*)$/);
  if (m) {
    parsed = {
      amount: Number(m[1]) + Number(m[2]) / Number(m[3]),
      unit: m[4].trim().toLowerCase() || null,
      notation,
    };
  }

  // "1/2 oz" — pure fraction
  if (!parsed) {
    m = notation.match(/^(\d+)\/(\d+)\s*(.*)$/);
    if (m) {
      parsed = {
        amount: Number(m[1]) / Number(m[2]),
        unit: m[3].trim().toLowerCase() || null,
        notation,
      };
    }
  }

  // "2 oz" or "1.5 oz" — decimal/whole
  if (!parsed) {
    m = notation.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
    if (m) {
      parsed = {
        amount: Number(m[1]),
        unit: m[2].trim().toLowerCase() || null,
        notation,
      };
    }
  }

  // "dash", "splash", "to taste" — word only
  if (!parsed) {
    parsed = { amount: null, unit: notation.toLowerCase(), notation };
  }

  if (parsed.unit === "cl" && parsed.amount != null) {
    return convertClToOz(parsed.amount);
  }
  return parsed;
}

// 3 cl ≈ 1 oz (IBA bartender shorthand — uses 3, not the exact 2.957,
// because IBA cl values are designed to map cleanly to oz when /3'd).
function convertClToOz(cl: number): ParsedMeasure {
  const oz = cl / 3;
  return { amount: oz, unit: "oz", notation: formatOzAmount(oz) + " oz" };
}

// Format an oz amount as a mixed fraction string using common bartender
// fractions: 1/4, 1/3, 1/2, 2/3, 3/4. Snaps to the nearest one.
function formatOzAmount(oz: number): string {
  const candidates: Array<[number, string]> = [
    [0, ""],
    [0.25, "1/4"],
    [1 / 3, "1/3"],
    [0.5, "1/2"],
    [2 / 3, "2/3"],
    [0.75, "3/4"],
    [1, "+1"], // signal: round whole up
  ];

  let whole = Math.floor(oz);
  const frac = oz - whole;

  let best = candidates[0];
  let bestDist = Math.abs(frac - best[0]);
  for (const c of candidates) {
    const d = Math.abs(frac - c[0]);
    if (d < bestDist) {
      best = c;
      bestDist = d;
    }
  }

  let fracStr = best[1];
  if (fracStr === "+1") {
    whole += 1;
    fracStr = "";
  }

  if (whole === 0 && !fracStr) return "0";
  if (!fracStr) return String(whole);
  if (whole === 0) return fracStr;
  return `${whole} ${fracStr}`;
}
