import { IonApp, IonRouterOutlet, IonHeader, IonToolbar, IonTitle, IonButton, IonButtons } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { Route, Redirect } from 'react-router-dom'
import { useState, useEffect } from 'react'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

/* Theme variables */
import './theme/variables.css'
import './styles/global.css' // ← Our global styles

/* Import pages */
import Home from './pages/Home'
import MakeLobby from './pages/MakeLobby'
import JoinLobby from './pages/JoinLobby'
import Lobby from './pages/Lobby'
import HowToPlay from './pages/HowToPlay'
import Results from './pages/Results'

const App: React.FC = () => {
  // Check if dark mode was previously enabled
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDarkEnabled = saved ? saved === 'true' : prefersDark

    // Apply the class to html element
    if (isDarkEnabled) {
      document.documentElement.classList.add('dark')
    }

    return isDarkEnabled
  })

  const toggleDarkMode = () => {
    const newDarkState = !isDark
    setIsDark(newDarkState)
    document.documentElement.classList.toggle('dark', newDarkState)
    localStorage.setItem('darkMode', String(newDarkState))
  }

  return (
    <IonApp>
      <IonReactRouter>
        {/* Global Header with Dark Mode Toggle */}
        <IonHeader>
          <IonToolbar>
            <IonTitle>Battle Words</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={toggleDarkMode}>
                {isDark ? '☀️' : '🌙'}
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        {/* Page Content */}
        <IonRouterOutlet>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/make-lobby">
            <MakeLobby />
          </Route>
          <Route exact path="/join-lobby">
            <JoinLobby />
          </Route>
          <Route exact path="/lobby/:roomCode">
            <Lobby />
          </Route>
          <Route exact path="/how-to-play">
            <HowToPlay />
          </Route>
          <Route exact path="/results">
            <Results />
          </Route>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  )
}

export default App