import { useState, useRef } from 'react';

type YesNoRadioButtonProps = {
    yesLabel: string;
    noLabel: string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;    
    name: string;
    htmlFor: string;
    // additional props...
};
/**
 * @brief
 * A custom radio button component with yes and no options.
 * The function onChange has to be generalized to handle the change
 * of the two radio buttons, differentiating them by their values on
 * their events: ["yes", "no"].
 * 
 * @component
 * @example
 * <YesNoRadioButton
 *   yesLabel="Yes"
 *   noLabel="No"
 *   handleChange={handleChange}
 *   name="isCorrect"
 *   htmlFor="isCorrect"
 * />
 */

const YesNoRadioButton: React.FC<YesNoRadioButtonProps> = ({ yesLabel, noLabel, handleChange, name, htmlFor, ...props }) => {        
    const radioNoRef = useRef<HTMLInputElement>(null);
    const radioYesRef = useRef<HTMLInputElement>(null);
    
    function handleContainerCLick(value: string) {        
        switch (value) {
            case "yes":
                radioYesRef.current?.click();
                break;
            case "no":
                radioNoRef.current?.click();
                break;
        }
    }
    return (
        <div {...props}>
            <div onClick={() => handleContainerCLick("yes")}>
                <input ref={radioYesRef} type="radio" id="yes" name={name} value="yes" onChange={handleChange}/>
                <label htmlFor={`${name}-yes`}>{yesLabel}</label>
            </div>
            <div onClick={() => handleContainerCLick("no")}>
                <input ref={radioNoRef}type="radio" id="no" name={name} value="no" onChange={handleChange} />
                <label htmlFor={`${name}-no`}>{noLabel}</label>
            </div>
        </div>
    );
};

export default YesNoRadioButton;