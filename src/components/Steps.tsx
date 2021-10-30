import React from 'react';

import CheckIcon from '@mui/icons-material/Check';
import StepConnector from '@mui/material/StepConnector';
import type { StepIconProps } from '@mui/material/StepIcon';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';

import { primaryColor, primaryColorLight2, successColor, warningColor } from 'src/styles/variables.const';

const StepIcon = ({ icon, active, completed, error }: StepIconProps) => {
  return (
    <div
      style={{
        backgroundColor: active ? primaryColor : error ? warningColor : 'white',
        color: completed ? (error ? 'white' : successColor) : active ? 'white' : primaryColor,
        width: '38px',
        height: '38px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        border: completed ? (error ? `1px solid ${warningColor}` : `1px solid ${successColor}`) : `1px solid ${primaryColor}`,
      }}
    >
      {completed && !error ? <CheckIcon /> : icon}
    </div>
  );
};

interface StepsProps {
  steps: string[];
  activeStep?: number;
  errorSteps?: number[];
}

export const Steps = ({ steps, activeStep = 0, errorSteps = [] }: StepsProps) => {
  return (
    <div className="custom-steps--container" style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: '43px', left: '10%', right: '10%', borderTop: `1px solid ${primaryColorLight2}`, zIndex: 0 }}></div>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        connector={
          <StepConnector
            sx={{
              top: '16.5px',
              left: '-2.5px',
              right: 'unset',
              '& .MuiStepConnector-line': { border: 'none', width: '5px', height: '5px', borderRadius: '2.5px', backgroundColor: primaryColorLight2 },
            }}
          />
        }
        sx={{ zIndex: 1, position: 'relative', background: 'none', p: 3 }}
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel StepIconComponent={StepIcon} error={errorSteps.includes(index)}>
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
};
