import { FormLabel, RadioGroup } from "@mui/material";
import Radiosbutton from "../components/Radiosbutton";

export default function Radiobutton({radiobuttons, radioValue, setRadioValue}) {
    return (
        <div>
        <FormLabel>Pay method</FormLabel>
          <RadioGroup
            row
            defaultValue="Cash"
            name="radio-buttons-group"
            value={radioValue}
            onChange={(event) => setRadioValue(event.target.value)}
          >
            {radiobuttons.map((item) => (
              <Radiosbutton
                key={item.label}
                label={item.label}
                value={item.value}
              />
            ))}
          </RadioGroup>
        </div>
    );
  }