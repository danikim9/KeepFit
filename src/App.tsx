import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppStateProvider, useAppState } from './state/AppState'
import Invite from './screens/Invite'
import Program from './screens/Program'
import CallSetup from './screens/CallSetup'
import Home from './screens/Home'
import LiveCall, { IncomingCall } from './screens/LiveCall'
import CallSummary from './screens/CallSummary'
import Report from './screens/Report'
import Guide from './screens/Guide'
import Alert from './screens/Alert'
import GuideDetail from './screens/GuideDetail'
import PhoneHome from './screens/PhoneHome'

function Start() {
  const { onboarded } = useAppState()
  return <Navigate to={onboarded ? '/home' : '/invite'} replace />
}

export default function App() {
  return (
    <AppStateProvider>
      {/* HashRouter: works on any static host without rewrite rules */}
      <HashRouter>
        <IncomingCall />
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/invite" element={<Invite />} />
          <Route path="/program" element={<Program />} />
          <Route path="/setup" element={<CallSetup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/call" element={<LiveCall />} />
          <Route path="/summary" element={<CallSummary />} />
          <Route path="/report" element={<Report />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/guide/:id" element={<GuideDetail />} />
          <Route path="/alert" element={<Alert />} />
          <Route path="/checkin" element={<LiveCall />} />
          <Route path="/os" element={<PhoneHome />} />
          <Route path="*" element={<Start />} />
        </Routes>
      </HashRouter>
    </AppStateProvider>
  )
}
