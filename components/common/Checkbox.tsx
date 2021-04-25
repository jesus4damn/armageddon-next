import React, { VoidFunctionComponent } from "react";
import styled from "styled-components";

const HiddenCheckbox = styled.input.attrs({
    type: 'checkbox'
})`
    display: none;  
`;

const Icon = styled.svg<{withLabel: boolean}>`
  transform: translateY(${({withLabel}) => withLabel ? '-7' : '-5'}px);
  fill: none;
  stroke: white;
  stroke-width: 2px;
`;

const CustomCheckbox = styled.label<{checked: boolean}>`
    display: inline-block;
    position: relative;
    transition: all 150ms;
    box-sizing: border-box;
    cursor: pointer;
    flex: none;
    margin-bottom: 0;
    padding: 4px 2px;
    width: 18px;
    height: 18px;
    border-radius: 3px;
    border: ${({checked}) => checked ? 'none' : '3px solid #212121'};
    background-color: ${({checked}) => checked ? '#3D404E' : '#FFFFFF'};
    cursor: pointer;
`;

const Label = styled.span`
    font-size: 16px;
    margin-left: 10px;
    margin-top: 3px;
`;

const Checkbox = ({value, label, onClick, ...props}: {value: boolean, label?: string, onClick: () => void}) => (
    <div className="position-relative d-flex align-items-center" style={{cursor:'pointer'}}>
        <CustomCheckbox checked={value} htmlFor={`checkbox`}>
            {
                value
                    ? (<Icon withLabel={!!label} viewBox="0 0 14 10"><polyline points="1 4.5, 5 8.5, 13 0.5" /></Icon>)
                    : ''
            }
        </CustomCheckbox>
        <HiddenCheckbox id={`checkbox`} checked={value} onClick={onClick} readOnly {...props} />
        {label && <Label onClick={onClick}>{label}</Label>}
    </div>
)


export default React.memo(Checkbox, (prevProps, nextProps) => {
    return prevProps.value === nextProps.value
});