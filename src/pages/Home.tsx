import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useState } from 'react';
import Name from '../components/Name';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Testing IndexedDB API</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <Name/>
      </IonContent>
    </IonPage>
  );
};

export default Home;
