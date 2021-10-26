import React from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { primaryColor } from 'src/styles/variables.const';

type Option<T> = {
  key: number | string;
  label: string;
  value: T;
};

interface FilterSelectProps<T> {
  options: Option<T>[];
  name: string;
  value: number | string;
  onChange(option: Option<T>): void;
}

export const FilterSelect = <T extends unknown>({ value, onChange, name, options }: FilterSelectProps<T>) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedOption = options.find((o) => o.key === value) || null;

  return (
    <div style={{ position: 'relative', marginLeft: '0.5rem' }}>
      <div
        style={{ display: 'inline-block', cursor: 'pointer', border: `1px solid ${primaryColor}`, borderRadius: '5px' }}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <div
          style={{
            padding: '0 0.4rem',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span className="text text--small" style={{ marginRight: '0.2rem' }}>
            {name}
          </span>
          <span
            className="text text--small bg-primary-light"
            style={{ padding: '0.2rem 0.5rem', borderRadius: '0.8rem', textDecoration: 'underline' }}
          >
            {selectedOption?.label || ''}
          </span>
          <ExpandMoreIcon />
        </div>
      </div>

      {isOpen && (
        <ClickAwayListener
          onClickAway={() => {
            setIsOpen(false);
          }}
        >
          <div
            style={{
              display: 'inline-block',
              border: `1px solid ${primaryColor}`,
              borderRadius: '5px',
              position: 'absolute',
              top: 0,
              left: 0,
              backgroundColor: 'white',
              zIndex: 20,
            }}
          >
            <div
              style={{
                padding: '0 0.4rem',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <span className="text text--small" style={{ marginRight: '0.2rem' }}>
                {name}
              </span>
              <span
                className="text text--small bg-primary-light"
                style={{ padding: '0.2rem 0.5rem', borderRadius: '0.8rem', textDecoration: 'underline' }}
              >
                {selectedOption?.label || ''}
              </span>
              <ExpandLessIcon />
            </div>

            <div style={{ padding: '0 0.4rem' }}>
              <FormGroup>
                {options.map((option) => (
                  <FormControlLabel
                    key={option.key}
                    style={{ margin: 0, cursor: 'pointer' }}
                    control={
                      <Checkbox
                        size="small"
                        style={{ padding: '0', marginRight: '0.5rem' }}
                        checked={selectedOption.key === option.key}
                        onChange={() => {
                          onChange(option);
                          setIsOpen(false);
                        }}
                        name={`${option.key}`}
                        color="primary"
                      />
                    }
                    label={
                      <span className="text text--small" style={{ cursor: 'pointer' }}>
                        {option.label}
                      </span>
                    }
                  />
                ))}
              </FormGroup>
            </div>
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
};
