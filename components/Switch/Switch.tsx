import { faDollarSign, faEuroSign } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"

type SwitchProps = {
  checked: boolean
  onSwitch: () => void
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onSwitch,
}) => {
  return (
    <label className="switch">
      <FontAwesomeIcon icon={ faDollarSign } size="sm" />
      <input type="checkbox" checked={checked} onChange={onSwitch} />
      <span className="slider" />
      <FontAwesomeIcon icon={ faEuroSign } size="sm" />
      <style>{`
        .switch {
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          height: 24px;
          font-size: 24px;
        }

        .switch input {
          display: none;
        }

        .slider {
          position: relative;
          width: 64px;
          height: 32px;
          flex-grow: 1;
          cursor: pointer;
          background-color: white;
          border-radius: 32px;
          transition: .4s;
        }

        .slider:before {
          position: absolute;
          top: 4px;
          left: 4px;
          content: '';
          height: 24px;
          width: 24px;
          background-color: #00947e;
          border-radius: 100%;
          transition: .4s;
        }

        input:checked + .slider {
          background-color: white;
        }
        
        input:focus + .slider {
          box-shadow: 0 0 1px #2196F3;
        }

        input:checked + .slider:before {
          transform: translateX(32px);
        }
      `}</style>
    </label>
  )
}

export default Switch
