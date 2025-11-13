import '../../index.css';
import styles from './app.module.css';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { ProtectedRoute } from '../ProtectedRoute';
import { useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { getIngredientsThunk, getUserThunk } from '@slices';
import {
  Route,
  Routes,
  useLocation,
  useMatch,
  useNavigate
} from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';

const App = () => {
  const navigator = useNavigate();
  const currentLocation = useLocation();

  const appDispatch = useDispatch();

  const profOrderNumber = useMatch('/profile/orders/:number')?.params.number;
  const feedOrderNumber = useMatch('/feed/:number')?.params.number;
  const displayedOrderNumber = profOrderNumber || feedOrderNumber;

  const locState = currentLocation.state as
    | { background?: Location }
    | undefined;
  const modalBackground = locState?.background;

  const handleCloseModal = () => {
    navigator(-1);
  };

  useEffect(() => {
    appDispatch(getUserThunk());
    appDispatch(getIngredientsThunk());
  }, [appDispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={modalBackground || currentLocation}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyAuth={false}>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyAuth={false}>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyAuth={false}>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyAuth={false}>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute onlyAuth>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute onlyAuth>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
        <Route
          path='/feed/:number'
          element={
            <div className={styles.app}>
              <OrderInfo />
            </div>
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            <div className={styles.app}>
              <IngredientDetails />
            </div>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <div className={styles.app}>
              <ProtectedRoute onlyAuth>
                <OrderInfo />
              </ProtectedRoute>
            </div>
          }
        />
      </Routes>

      {modalBackground && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal
                title={`#${displayedOrderNumber && displayedOrderNumber.padStart(6, '0')}`}
                onClose={handleCloseModal}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title={'Детали ингредиента'} onClose={handleCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal
                title={`#${displayedOrderNumber && displayedOrderNumber.padStart(6, '0')}`}
                onClose={handleCloseModal}
              >
                <ProtectedRoute onlyAuth>
                  <OrderInfo />
                </ProtectedRoute>
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
