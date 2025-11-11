import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { TUser } from '@utils-types';
import { updateUserThunk, userDataSelector as selectUserData } from '@slices';

export const Profile: FC = () => {
  // диспатч для отправки thunk-ов
  const appDispatch = useDispatch();

  // текущий пользователь из стора (может быть undefined пока не подгружен)
  const currentUser = useSelector(selectUserData) as TUser | undefined;

  // локальное состояние формы (инициализируем из user или пустыми строками)
  const [values, setValues] = useState({
    name: currentUser?.name ?? '',
    email: currentUser?.email ?? '',
    password: ''
  });

  // синхронизируем форму с актуальными данными пользователя при их обновлении
  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      name: currentUser?.name ?? '',
      email: currentUser?.email ?? ''
    }));
  }, [currentUser]);

  // флаг — были ли изменения в форме по сравнению с текущим пользователем
  const isFormChanged =
    values.name !== (currentUser?.name ?? '') ||
    values.email !== (currentUser?.email ?? '') ||
    Boolean(values.password);

  // отправка формы — обновляем пользователя
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    // минимальная валидация: должны быть имя и email (пароль может быть пустым)
    if (!values.name || !values.email) return;

    appDispatch(updateUserThunk(values));

    // после отправки сбрасываем поле пароля и подстраиваем форму под актуальные данные
    setValues({
      name: currentUser?.name ?? values.name,
      email: currentUser?.email ?? values.email,
      password: ''
    });
  };

  // отмена изменений — возвращаем поля к текущему пользователю
  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setValues({
      name: currentUser?.name ?? '',
      email: currentUser?.email ?? '',
      password: ''
    });
  };

  // обновление отдельных полей формы
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <ProfileUI
      formValue={values}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
