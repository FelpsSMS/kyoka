import { Switch } from "@headlessui/react";

export default function ToggleButton({
  enabled,
  setEnabled,
  textColor,
  label,
}) {
  return (
    <Switch.Group>
      <div className="flex flex-col items-center justify-center md:flex-row my-2">
        <Switch.Label className={`m-4 font-bold text-${textColor}`}>
          {label}
        </Switch.Label>
        <Switch
          checked={enabled}
          onChange={setEnabled}
          className={`${
            enabled ? "bg-gray-800" : "bg-gray-200"
          } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none 
          focus:ring-2 focus:ring-offset-2 focus:ring-black`}
        >
          <span
            className={`${
              enabled ? "translate-x-6" : "translate-x-1"
            } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
          />
        </Switch>
      </div>
    </Switch.Group>
  );
}
