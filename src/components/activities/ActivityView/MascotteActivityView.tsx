import React from 'react';

import { Grid, Box } from '@material-ui/core';

import type { PresentationMascotteActivity } from 'src/activity-types/presentation.types';
import { AvatarImg } from 'src/components/Avatar';

import { ImageView } from '../content/views/ImageView';

import type { ActivityViewProps } from './activity-view.types';

export const MascotteActivityView = ({ activity }: ActivityViewProps<PresentationMascotteActivity>) => {
  return (
    <div>
      {activity && (
        <>
          <Grid container spacing={0} style={{ marginTop: '2rem' }}>
            <Grid item xs={12} md={12}>
              <div style={{ marginRight: '0.25rem' }}>
                {activity.processedContent.length > 0 &&
                  activity.processedContent[0].value.split('\n').map((s, index) => (
                    <p key={index} style={{ margin: '0.5rem 0' }}>
                      {s}
                    </p>
                  ))}
              </div>
            </Grid>
            <Grid item xs={12} md={12} style={{ display: 'flex' }}>
              <ImageView id={1} value={activity.data.classImg} />
              {activity.data.classImgDesc}
            </Grid>
            <Grid item xs={12} md={4}>
              <Box display="flex" justifyContent="center" m={4}>
                <AvatarImg src={activity.data.mascotteImage} noLink />
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <div style={{ alignItems: 'center', display: 'flex', height: '100%' }}>
                <div>
                  {activity.processedContent.length > 1 &&
                    activity.processedContent[1].value.split('\n').map((s, index) => (
                      <p key={index} style={{ margin: '0.5rem 0' }}>
                        {s}
                      </p>
                    ))}
                </div>
              </div>
            </Grid>
          </Grid>
          <div>
            {activity.processedContent.length > 2 &&
              activity.processedContent[2].value.split('\n').map((s, index) => (
                <p key={index} style={{ margin: '0.5rem 0' }}>
                  {s}
                </p>
              ))}
          </div>
        </>
      )}
    </div>
  );
};
