import { useSnackbar } from 'notistack';
import React from 'react';

import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Button from '@mui/material/Button';
import MobileStepper from '@mui/material/MobileStepper';
import { Checkbox } from '@mui/material';

import { MissingStepModal } from 'src/components/MissingStepModal';
import { Modal } from 'src/components/Modal';
import { PanelInput } from 'src/components/mon-compte/PanelInput';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { bgPage, defaultOutlinedButtonStyle, defaultTextButtonStyle } from 'src/styles/variables.const';
import PelicoSearch from 'src/svg/pelico/pelico-search.svg';
import { getUserDisplayName } from 'src/utils';
import { ActivityStatus, ActivityType } from 'types/activity.type';
import type { User } from 'types/user.type';
import { UserType } from 'types/user.type';

import { CGU } from './CGU';
import { Flag } from './Flag';
import { ActivityCard } from './activities/ActivityCard';

export const WelcomeModal = () => {
  const { user, setUser, axiosLoggedRequest } = React.useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const { village } = React.useContext(VillageContext);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [loading, setIsLoading] = React.useState(false);
  const [newUser, setNewUser] = React.useState<Partial<User>>(user);
  const [isVisible, setIsVisible] = React.useState<boolean>(false);
  const [updateAsked, setUpdateAsked] = React.useState({
    village: false,
    country: false,
  });
  const [cguChecked, setCguChecked] = React.useState(false);

  React.useEffect(() => {
    setNewUser(user);
  }, [user]);

  if (user === null || village === null || user.type >= UserType.OBSERVATOR) {
    return null;
  }

  const updateUser = async () => {
    if (!newUser.city || !newUser.address || !newUser.postalCode) {
      return;
    }
    setIsLoading(true);
    const updatedValues = {
      school: newUser.school,
      level: newUser.level,
      city: newUser.city,
      postalCode: newUser.postalCode,
      address: newUser.address,
      pseudo: newUser.pseudo,
      email: newUser.email,
      displayName: newUser.displayName,
    };
    const response = await axiosLoggedRequest({
      method: 'PUT',
      url: `/users/${user.id}`,
      data: updatedValues,
    });
    if (response.error) {
      enqueueSnackbar('Une erreur inconnue est survenue...', {
        variant: 'error',
      });
    } else {
      setUser({ ...user, ...updatedValues, firstLogin: false });
    }
    setIsLoading(false);
  };

  const sendError = (error: 'village' | 'country') => async () => {
    // do not ask twice
    if (updateAsked[error]) {
      enqueueSnackbar(
        error === 'country'
          ? 'Une demande de changement de pays a été envoyé à un administrateur !'
          : 'Une demande de changement de village a été envoyé à un administrateur !',
        {
          variant: 'success',
        },
      );
      return;
    }

    const response = await axiosLoggedRequest({
      method: 'POST',
      url: '/users/ask-update',
      data: {
        error,
      },
    });
    if (response.error) {
      enqueueSnackbar('Une erreur inconnue est survenue...', {
        variant: 'error',
      });
    } else {
      enqueueSnackbar(
        error === 'country'
          ? 'Une demande de changement de pays a été envoyé à un administrateur !'
          : 'Une demande de changement de village a été envoyé à un administrateur !',
        {
          variant: 'success',
        },
      );
      setUpdateAsked({ ...updateAsked, [error]: true });
    }
  };

  return user.firstLogin ? (
    <Modal
      open={true}
      title="Bienvenue à 1Village !"
      cancelLabel="Continuer"
      maxWidth="lg"
      fullWidth
      onClose={() => {}}
      noCloseButton
      loading={loading}
      noCloseOutsideModal
      ariaDescribedBy="new-user-desc"
      ariaLabelledBy="new-user-title"
      actions={
        <div style={{ width: '100%' }}>
          <MobileStepper
            style={{ backgroundColor: 'unset' }}
            variant="dots"
            steps={4}
            activeStep={currentStep}
            nextButton={
              <Button
                size="small"
                color={currentStep >= 2 ? 'primary' : 'inherit'}
                variant={currentStep >= 2 ? 'contained' : 'text'}
                sx={currentStep < 2 ? defaultTextButtonStyle : undefined}
                disabled={(currentStep === 3 && (!newUser.city || !newUser.address || !newUser.postalCode)) || (currentStep === 2 && !cguChecked)}
                onClick={() => {
                  if (currentStep !== 3) {
                    setCurrentStep(currentStep + 1);
                  } else {
                    updateUser();
                  }
                }}
              >
                {currentStep === 2 ? 'Accepter' : currentStep === 3 ? 'Terminer' : 'Suivant'}
                {currentStep < 2 && <KeyboardArrowRight />}
              </Button>
            }
            backButton={
              <Button
                size="small"
                color="inherit"
                sx={defaultTextButtonStyle}
                onClick={() => {
                  setCurrentStep(currentStep - 1);
                }}
                disabled={currentStep === 0}
              >
                {<KeyboardArrowLeft />}
                Précedent
              </Button>
            }
            position="static"
          />
        </div>
      }
    >
      <div id="new-user-desc" style={{ minHeight: '20rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {currentStep === 0 && (
          <div className="text-center">
            <span style={{ fontSize: '1.1rem' }}>Votre classe appartient au village</span>
            <br />
            <Button variant="contained" color="primary" size="medium" onClick={() => setIsVisible(!isVisible)}>
              {isVisible ? 'Cacher' : 'Montrer'}
            </Button>
            <h2 style={{ fontSize: '1.2rem', margin: '1rem 0', visibility: isVisible ? 'visible' : 'hidden' }} className="text--primary">
              {village.name}
            </h2>
            <a style={{ marginTop: '2rem', cursor: 'pointer' }} onClick={sendError('village')}>
              {"Ce n'est pas mon village !"}
            </a>
          </div>
        )}
        {currentStep === 1 && (
          <div className="text-center">
            <span style={{ fontSize: '1.1rem' }}>Votre pays</span>
            <br />
            <h2 style={{ fontSize: '1.2rem', margin: '1rem 0' }} className="text--primary">
              <span style={{ marginRight: '0.5rem' }}>{user ? user.country.name : ''}</span>
              {user && <Flag country={user.country.isoCode}></Flag>}
            </h2>
            <Button
              color="inherit"
              sx={defaultOutlinedButtonStyle}
              size="small"
              variant="outlined"
              style={{ marginTop: '2rem' }}
              onClick={sendError('country')}
            >
              {"Ce n'est pas mon pays !"}
            </Button>
          </div>
        )}
        {currentStep === 2 && (
          <>
            <div style={{ height: '19rem', overflow: 'scroll', maxWidth: '800px', margin: '0 auto' }}>
              <CGU />
            </div>
            <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto', textAlign: 'right' }}>
              <label style={{ cursor: 'pointer' }}>
                <Checkbox
                  checked={cguChecked}
                  onChange={(event) => {
                    setCguChecked(event.target.checked);
                  }}
                />
                <span>{"J'accepte les conditions générales d'utilisation du site"}</span>
              </label>
            </div>
          </>
        )}
        {currentStep === 3 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
              <PelicoSearch style={{ width: '4rem', height: 'auto', marginRight: '1rem' }} />
              <span className="text text--bold">
                Suite à votre première connection, Pelico a récupéré les informations suivantes sur votre classe. Pouvez les mettre à jour si
                nécessaire ?
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'stretch' }}>
              <div style={{ flex: 1, marginRight: '1rem', minWidth: 0 }}>
                <PanelInput
                  value={newUser.school}
                  defaultValue={'non renseignée'}
                  label="École :"
                  placeholder="Nom de votre école"
                  isEditMode
                  onChange={(school) => {
                    setNewUser((u) => ({ ...u, school }));
                  }}
                />
                <PanelInput
                  value={newUser.level}
                  defaultValue={'non renseigné'}
                  label="Niveau de la classe :"
                  placeholder="Niveau de votre classe"
                  isEditMode
                  onChange={(level) => {
                    setNewUser((u) => ({ ...u, level }));
                  }}
                />
                <PanelInput
                  value={newUser.address}
                  defaultValue={'non renseigné'}
                  label="Adresse de l'école :"
                  placeholder="Adresse"
                  hasError={!newUser.address}
                  errorMsg="Requis"
                  isEditMode
                  onChange={(address) => {
                    setNewUser((u) => ({ ...u, address }));
                  }}
                />
                <PanelInput
                  value={newUser.city}
                  defaultValue={'non renseigné'}
                  label="Ville :"
                  placeholder="Ville"
                  hasError={!newUser.city}
                  errorMsg="Requis"
                  isEditMode
                  onChange={(city) => {
                    setNewUser((u) => ({ ...u, city }));
                  }}
                />
                <PanelInput
                  value={newUser.postalCode}
                  defaultValue={'non renseigné'}
                  label="Code postal :"
                  placeholder="Code postal"
                  hasError={!newUser.postalCode}
                  errorMsg="Requis"
                  isEditMode
                  onChange={(postalCode) => {
                    setNewUser((u) => ({ ...u, postalCode }));
                  }}
                />
                <PanelInput value={user.country.name} defaultValue={''} label="Pays :" placeholder="Pays" isEditMode={false} />
                <PanelInput
                  style={{ marginTop: '2rem' }}
                  value={newUser.displayName}
                  defaultValue={'non renseigné'}
                  label="Nom affiché :"
                  placeholder={getUserDisplayName({ ...user, ...newUser, type: 0 }, false)}
                  isEditMode
                  onChange={(displayName) => {
                    setNewUser((u) => ({ ...u, displayName }));
                  }}
                />
              </div>
              <div style={{ flex: 1, backgroundColor: bgPage, padding: '0.5rem 1rem', minWidth: 0 }}>
                <span className="text text--bold">Une activité de votre classe apparaîtra comme suit:</span>
                <ActivityCard
                  activity={{
                    id: 0,
                    type: ActivityType.PRESENTATION,
                    userId: user?.id,
                    villageId: 0,
                    responseActivityId: null,
                    responseType: null,
                    data: {
                      theme: 0,
                    },
                    status: ActivityStatus.PUBLISHED,
                    createDate: new Date(),
                    content: [
                      {
                        type: 'text',
                        value: '........................',
                        id: 0,
                      },
                    ],
                  }}
                  user={{ ...user, ...newUser, type: 0, id: -1 }}
                  noButtons
                />
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  ) : (
    currentStep === 3 && village?.activePhase > 1 && <MissingStepModal />
  );
};
