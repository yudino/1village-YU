import React from 'react';

import Button from '@material-ui/core/Button';

import { Modal } from 'src/components/Modal';
import { VillageContext } from 'src/contexts/villageContext';

export const MissingStepModal = () => {
  const { village, setSelectedPhase } = React.useContext(VillageContext);
  const [isModalOpen, setIsModalOpen] = React.useState(true);


  return (
    <div style={{ width: '100%' }}>
    <Modal
      open={isModalOpen}
      title="La phase 2 est active, et l'identité de vos Pélicopains est dévoilée !"
      maxWidth="lg"
      fullWidth
      onClose={() => { }}
      noCloseOutsideModal
      ariaDescribedBy="missing-step-desc"
      ariaLabelledBy="missing-step-title"
      actions={
         <>
          <div id="new-user-desc" style={{ minHeight: '15rem', display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '2rem' }}>
            <div><p>Si vous n'avez pas encore résolu l'énigme avec votre classe, retournez sur la phase 1.</p>
              <Button
                component="a"
                onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                  event.preventDefault();
                  setSelectedPhase(1)
                  setIsModalOpen(false);
                }}
                href={'/'}
                color="primary"
                variant={'outlined'}
                className="navigation__button full-width"
                style={{
                  justifyContent: 'flex-start',
                  width: 'auto'
                }}
              >
                Retournez sur la phase 1
              </Button></div>
            <div><p>Si vous souhaitez débuter les échanges avec vos Pélicopains, poursuivez sur la phase 2.</p>
              <Button
                component="a"
                onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                  event.preventDefault();
                  setIsModalOpen(false);
                }}
                href={'/'}
                color="primary"
                variant={'outlined'}
                className="navigation__button full-width"
                style={{
                  justifyContent: 'flex-start',
                  width: 'auto'
                }}
              >
                Poursuivez sur la phase 2
              </Button></div>
          </div>
        </>}
    />
    </div>
  );
};
