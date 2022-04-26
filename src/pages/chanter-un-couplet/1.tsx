import { useRouter } from 'next/router';
import React from 'react';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import type { VerseRecordData } from 'src/activity-types/verseRecord.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import AudioMixer from 'src/components/audio/Mixer';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { concatAudios, mixAudios } from 'src/utils/audios';

const SongStep1 = () => {
  const router = useRouter();
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const { activity, updateActivity } = React.useContext(ActivityContext);
  const [isLoading, setIsLoading] = React.useState(false);

  const data = (activity?.data as VerseRecordData) || null;

  const onNext = async () => {
    setIsLoading(true);
    if (data.customizedMixBlob && data.customizedMixBlob.size > 0) {
      const formData = new FormData();
      formData.append('audio', data.customizedMixBlob, 'classVerse.webm');
      const response = await axiosLoggedRequest({
        method: 'POST',
        url: '/audios',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const customizedMixWithVocals = await mixAudios([data?.verseAudios[0], { value: response.data.url }], axiosLoggedRequest);
      const mixWithoutLyrics = await concatAudios([data.introOutro[0], { value: response.data.url }, data.introOutro[1]], axiosLoggedRequest);
      updateActivity({ data: { ...data, mixWithoutLyrics, customizedMixWithVocals, customizedMix: response.data.url, customizedMixBlob: null } });
    }
    setIsLoading(false);
    router.push('/chanter-un-couplet/2');
  };

  if (!activity) {
    return (
      <Base>
        <div></div>
      </Base>
    );
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={['Mixer', 'Écrire', 'Enregistrer', 'Synchroniser', 'Prévisualiser']}
          activeStep={0}
          urls={['/chanter-un-couplet/1', '/chanter-un-couplet/2', '/chanter-un-couplet/3', '/chanter-un-couplet/4', '/chanter-un-couplet/5']}
        />
        <div className="width-900">
          <h1>Mixez votre couplet</h1>
          <p>
            Avant de composer votre couplet et de l&apos;enregistrer, je vous propose de moduler la musique de notre hymne, en jouant avec cette table
            de montage simplifiée.{' '}
          </p>
          <p>
            Lancez l&apos;enregistrement de votre couplet en appuyant sur le bouton bleu &quot;Enregistrer&quot; sous la table de mixage. Une fois
            l&apos;enregistrement lancé, il vous faut enregistrer toute la durée du couplet indiqué par le minuteur.
          </p>
          <p>
            Vous pourrez alors écouter votre mix avant de passer à la prochaine étape d&apos;écriture de votre couplet. Libre à vous de recommencer
            votre mix avant de passer à cette étape suivante !
          </p>
          {data && <AudioMixer />}
        </div>
      </div>
      <StepsButton next={onNext} />
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default SongStep1;
