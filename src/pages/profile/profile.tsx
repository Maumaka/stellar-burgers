import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { TUser } from '@utils-types';
import { updateUserThunk, userDataSelector as selectUserData } from '@slices';

export const Profile: FC = () => {
  const appDispatch = useDispatch();
  const currentUser = useSelector(selectUserData) as TUser | undefined;
  const [values, setValues] = useState({
    name: currentUser?.name ?? '',
    email: currentUser?.email ?? '',
    password: ''
  });

  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      name: currentUser?.name ?? '',
      email: currentUser?.email ?? ''
    }));
  }, [currentUser]);

  const isFormChanged =
    values.name !== (currentUser?.name ?? '') ||
    values.email !== (currentUser?.email ?? '') ||
    Boolean(values.password);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!values.name || !values.email) return;

    appDispatch(updateUserThunk(values));

    setValues({
      name: currentUser?.name ?? values.name,
      email: currentUser?.email ?? values.email,
      password: ''
    });
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setValues({
      name: currentUser?.name ?? '',
      email: currentUser?.email ?? '',
      password: ''
    });
  };

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
