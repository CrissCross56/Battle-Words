import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import Home from './pages/Home';
import JoinLobby from './pages/JoinLobby';
import MakeLobby from './pages/MakeLobby';
import GameLobby from './pages/GameLobby';
import HowToPlay from './pages/HowToPlay';
import Game from './pages/Game';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        <Route exact path="/join-lobby">
          <JoinLobby />
        </Route>
        <Route exact path="/make-lobby">
          <MakeLobby />
        </Route>
        <Route exact path="/game-lobby/:roomCode">
          <GameLobby />
        </Route>
        <Route exact path="/how-to-play">
          <HowToPlay />
        </Route>
        <Route exact path="/game/:roomCode">
          <Game />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;