import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppStateProvider, useAppState } from './state/AppState'
import Invite from './screens/Invite'
import Program from './screens/Program'
import RecordSetup from './screens/RecordSetup'
import CheckIn from './screens/CheckIn'
import Sos from './screens/Sos'
import Ask from './screens/Ask'
import Home from './screens/Home'
import LiveCall from './screens/LiveCall'
import CallSummary from './screens/CallSummary'
import Report from './screens/Report'
import Guide from './screens/Guide'
import Alert from './screens/Alert'
import GuideDetail from './screens/GuideDetail'

function Start() {
  const { onboarded } = useAppState()
  return <Navigate to={onboarded ? '/home' : '/invite'} replace />
}

export default function App() {
  return (
    <AppStateProvider>
      {/* HashRouter: works on any static host without rewrite rules */}
      <HashRouter>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/invite" element={<Invite />} />
          <Route path="/program" element={<Program />} />
          <Route path="/setup" element={<RecordSetup />} />
          <Route path="/checkin" element={<CheckIn />} />
          <Route path="/sos" element={<Sos />} />
          <Route path="/ask" element={<Ask />} />
          <Route path="/home" element={<Home />} />
          <Route path="/call" element={<LiveCall />} />
          <Route path="/summary" element={<CallSummary />} />
          <Route path="/report" element={<Report />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/guide/:id" element={<GuideDetail />} />
          <Route path="/alert" element={<Alert />} />
          <Route path="*" element={<Start />} />
        </Routes>
      </HashRouter>
    </AppStateProvider>
  )
}
