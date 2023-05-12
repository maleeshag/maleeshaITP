import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { useMemo } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { themeSettings } from 'theme';
import Layout from './Attendee/scenes/layout';
import Dashboard from './Attendee/scenes/dashboard';
import FeedBacks from './Attendee/scenes/feedBacks';
import Attendees from './Attendee/scenes/attendees';
import DataFinalists from './Attendee/scenes/dataFinalists';
import Overview from './Attendee/scenes/overview';
import Daily from './Attendee/scenes/daily';
import Monthly from './Attendee/scenes/monthly';
import Breakdown from './Attendee/scenes/breakdown';
import RSVPEMAIL from './Attendee/scenes/revpemail';
import Administrator from './Attendee/scenes/administrator';
import AttendeeStatus from './Attendee/scenes/attendeeStatus';
import ELayout from './Events/scenes/layout';
import EDashboard from './Events/scenes/dashboard';
import LoginPage from './Events/scenes/login';
import AllEventsTable from './Events/tables/AllEventsTable';
import SingleEvent from './Events/SingleEvent';
import AllEventView from './Events/AllEventView';
import AllEvents from './Events/AllEvents';
import EventCreationForm from 'Events/components/registrationForm';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import RLayout from './Resource/scenes/layout';
import RDashboard from './Resource/scenes/dashboard';
import ResourcesTable from './Resource/tables/allResources';
import PageNotFound from './Events/pages/PageNotFound.jsx';
import AllResourcesView from 'Resource/pages/AllResourcesView';
import Speaker from 'Partners/organizer/speakers';
import Sponsors from 'Partners/organizer/sponsors';
import Volunteers from 'Partners/organizer/volunteers';
import Opportunities from 'Partners/organizer/opportunities';
import OpportunitiesList from 'Partners/user/volunteer/OpportunitiesList';
import AppliedOpportunitiesList from 'Partners/user/volunteer/AppliedOpportunitiesList';
import UpdateVolunteerApplication from 'Partners/user/volunteer/UpdateVolunteerApplication';
import OpportunityDetails from 'Partners/user/volunteer/OpportunityDetails';
// import OpportunityRegister from "Resource/components/registrationForm";

import OpportunityRegister from 'Partners/user/volunteer/OpportunityRegister';

import VLayout from 'Venue/src/scenes/layout';
import VDashboard from 'Venue/src/scenes/dashboard';
import VFeedBacks from 'Venue/src/scenes/feedBacks';
import VAttendees from 'Venue/src/scenes/attendees';
import VDataFinalists from 'Venue/src/scenes/dataFinalists';
import VLoginPage from 'Venue/src/scenes/login';
import VReview from 'Venue/src/scenes/venue/review';
import VVenue from 'Venue/src/scenes/venue/venue';
import VVenueQuotation from 'Venue/src/scenes/venue/venue-report';
import VAddVenue from 'Venue/src/scenes/venue/add-venue';
import VVenuePage from 'Venue/src/scenes/venue/edit-venue-page';
import VVenueProfile from 'Venue/src/scenes/venue/venue-profile';

function App() {
  // const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(
    () => createTheme(themeSettings('light'))
    // , [mode]
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="app">
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {/* Event Routes */}
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/events" element={<AllEvents />} />
              <Route path="/events/:id" element={<SingleEvent />} />
              <Route
                path="/events/:id/register"
                element={<EventCreationForm />}
              />
              <Route path="/org" element={<LoginPage />} />

              <Route element={<ELayout />}>
                <Route
                  path="/org/dashboard/*"
                  element={<Navigate to="/org/dashboard" replace />}
                />
                <Route path="/org/dashboard" element={<EDashboard />} />
                <Route
                  path="/org/dashboard/events"
                  element={<AllEventsTable />}
                />
              </Route>
              {/* Attendee Routes */}
              <Route element={<Layout />}>
                <Route
                  path="/administrator/dashboard"
                  element={<Dashboard />}
                />
                <Route
                  path="/administrator/feedBacks"
                  element={<FeedBacks />}
                />
                <Route
                  path="/administrator/attendees"
                  element={<Attendees />}
                />
                <Route
                  path="/administrator/dataFinalists"
                  element={<DataFinalists />}
                />
                <Route path="/administrator/overview" element={<Overview />} />
                <Route path="/administrator/daily" element={<Daily />} />
                <Route path="/administrator/monthly" element={<Monthly />} />
                <Route
                  path="/administrator/breakdown"
                  element={<Breakdown />}
                />
                <Route
                  path="/administrator/rsvpemail"
                  element={<RSVPEMAIL />}
                />
                <Route
                  path="/administrator/administrator"
                  element={<Administrator />}
                />
                <Route
                  path="/administrator/attendeeStatus"
                  element={<AttendeeStatus />}
                />
              </Route>
              {/* Resource Routes */}
              <Route path="/admin/resources" element={<AllResourcesView />} />
              <Route element={<RLayout />}>
                <Route
                  path="/admin/resources/dashboard/*"
                  element={<Navigate to="/admin/resources/dashboard" replace />}
                />
                <Route
                  path="/admin/resources/dashboard"
                  element={<RDashboard />}
                />
                <Route
                  path="/admin/resources/dashboard/resources"
                  element={<ResourcesTable />}
                />
              </Route>
              <Route path="*" element={<PageNotFound />} />
              {/*Partner Routes */}
              <Route element={<ELayout />}>
                {/* <Route path="/admin/venue/dashboard/*" element={<Navigate to="/admin/venue/dashboard" replace />} /> */}
                <Route path="/org/dashboard/speakers/" element={<Speaker />} />
                <Route path="/org/dashboard/sponsors/" element={<Sponsors />} />
                <Route
                  path="/org/dashboard/volunteers/"
                  element={<Volunteers />}
                />
                <Route
                  path="/org/dashboard/opportunities/"
                  element={<Opportunities />}
                />
              </Route>
              <Route
                path="/event/opportunities/"
                element={<OpportunitiesList />}
              />
              <Route
                path="/event/opportunity/:opportunityID"
                element={<OpportunityDetails />}
              />
              <Route
                path="/applyAsAVolunteer/:opportunityID"
                element={<OpportunityRegister />}
              />
              <Route
                path="/event/appliedOpportunities/:userID"
                element={<AppliedOpportunitiesList />}
              />
              <Route
                path="/event/updateVolunteerApplication/:volunteerID"
                element={<UpdateVolunteerApplication />}
              />
              {/* venue routes */}
              <Route>
                <Route path="/admin/venue" element={<VLoginPage />} />
                <Route element={<VLayout />}>
                  <Route
                    path="/admin/venue/dashboard/*"
                    element={<Navigate to="/admin/venue/dashboard" replace />}
                  />
                  <Route
                    path="/admin/venue/dashboard"
                    element={<VDashboard />}
                  />
                  <Route
                    path="/admin/venue/feedBacks"
                    element={<h1>FeedBacks</h1>}
                  />
                  <Route
                    path="/admin/venue/attendees"
                    element={<h1>Attendees</h1>}
                  />
                  <Route
                    path="/admin/venue/dataFinalists"
                    element={<VDataFinalists />}
                  />
                  <Route path="/admin/venue/venues" element={<VVenue />} />

                  <Route
                    path="/admin/venue/venues/edit/:id"
                    element={<VVenuePage />}
                  />
                  <Route
                    path="/admin/venue/venues/:id"
                    element={<VVenueProfile />}
                  />
                  <Route
                    path="/admin/venue/report"
                    element={<VVenueQuotation />}
                  />

                  <Route path="/admin/venue/add" element={<VAddVenue />} />
                  <Route
                    path="/admin/venue/breakdown"
                    element={<Breakdown />}
                  />
                  <Route path="/admin/venue/reviews" element={<VReview />} />
                </Route>
              </Route>
              {/* venue routes */}
              <Route>
                <Route path="/admin/venue" element={<VLoginPage />} />
                <Route element={<VLayout />}>
                  <Route
                    path="/admin/venue/dashboard/*"
                    element={<Navigate to="/admin/venue/dashboard" replace />}
                  />
                  <Route
                    path="/admin/venue/dashboard"
                    element={<VDashboard />}
                  />
                  <Route
                    path="/admin/venue/feedBacks"
                    element={<h1>FeedBacks</h1>}
                  />
                  <Route
                    path="/admin/venue/attendees"
                    element={<h1>Attendees</h1>}
                  />
                  <Route
                    path="/admin/venue/dataFinalists"
                    element={<VDataFinalists />}
                  />
                  <Route path="/admin/venue/venues" element={<VVenue />} />

                  <Route
                    path="/admin/venue/venues/edit/:id"
                    element={<VVenuePage />}
                  />
                  <Route
                    path="/admin/venue/venues/:id"
                    element={<VVenueProfile />}
                  />
                  <Route
                    path="/admin/venue/report"
                    element={<VVenueQuotation />}
                  />

                  <Route path="/admin/venue/add" element={<VAddVenue />} />
                  <Route
                    path="/admin/venue/breakdown"
                    element={<Breakdown />}
                  />
                  <Route path="/admin/venue/reviews" element={<VReview />} />
                </Route>
              </Route>
            </Routes>
          </ThemeProvider>
        </BrowserRouter>
      </div>
    </LocalizationProvider>
  );
}

export default App;