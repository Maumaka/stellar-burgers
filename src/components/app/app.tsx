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
  // хуки для управления навигацией и получения положения
  const navigator = useNavigate();
  const currentLocation = useLocation();

  // диспатч для вызова thunk/экшенов
  const appDispatch = useDispatch();

  // извлекаем номер заказа из url (профиль или лента)
  const profOrderNumber = useMatch('/profile/orders/:number')?.params.number;
  const feedOrderNumber = useMatch('/feed/:number')?.params.number;
  const displayedOrderNumber = profOrderNumber || feedOrderNumber;

  // состояние локации для модальных окон
  const locState = currentLocation.state as
    | { background?: Location }
    | undefined;
  const modalBackground = locState?.background;

  // закрыть модальное окно — возвращаемся на предыдущую страницу
  const handleCloseModal = () => {
    navigator(-1);
  };

  // при монтировании загружаем пользователя и ингредиенты
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
            <ProtectedRoute onlyAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
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
              <ProtectedRoute>
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
                <ProtectedRoute>
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
