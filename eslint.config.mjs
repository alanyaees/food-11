// eslint-config-next ships native flat configs, so they are imported
// directly rather than through the legacy FlatCompat bridge.
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "generated-images/**",
      "scripts/.dbg.mjs",
      "next-env.d.ts",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    files: ["scripts/**/*.mjs"],
    rules: {
      // Dev-only CLI tooling: console output is the interface.
      "no-console": "off",
    },
  },
  {
    rules: {
      // Hydrating UI from localStorage / IntersectionObserver is a
      // legitimate effect. The React 19 rule flags the entire pattern.
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default eslintConfig;
