import { postEmailLogin } from '@api/auth';
import authCient from '@api/authClient';
import SubmitBtn from '@components/common/button/SubmitBtn';
import Back from '@components/common/back/Back';
import { LogoIcon } from '@components/common/icons/Icons';
import {
  ErrorMessage,
  AuthInput,
  KakaoLoginButton,
  SignupButton,
} from '@components/Auth';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import { AxiosError } from 'axios';
import type { AuthRequest } from '@/@types/auth.types';

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    resetField,
    formState: { errors },
  } = useForm<AuthRequest>({
    reValidateMode: 'onSubmit',
  });

  const [isLoginFailed, setIsLoginFailed] = useState<boolean>(false);

  const onLoginSubmit: SubmitHandler<AuthRequest> = async (data) => {
    const { email, password } = data;
    try {
      const res = await postEmailLogin({
        email,
        password,
      });
      if (res.data.status === 200) {
        authCient.defaults.headers.common['Authorization'] =
          res.data.data.tokenInfo.accessToken;
        navigate('/');
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error('로그인 중 에러 발생', err);
        if (err.response?.data.errorMessage) {
          setIsLoginFailed(true);
        }
      }
    }
  };

  // TODO 서지수 | 마크업 컴포넌트화 해야함

  return (
    <div className="flex h-[95vh] flex-col">
      <Back />
      <div className="mb-auto">
        <div className="mb-16 mt-14 flex flex-col items-center">
          <div className="mb-2">
            <LogoIcon />
          </div>
          <h1 className="body6 text-gray6">
            위플랜플랜즈에 오신 것을 환영합니다.
          </h1>
        </div>
        <form className="mb-auto" onSubmit={handleSubmit(onLoginSubmit)}>
          <AuthInput
            label={'이메일'}
            id="email"
            type="email"
            placeholder={'이메일을 입력하세요'}
            register={register('email', { required: '아이디를 입력해주세요.' })}
            inputValue={watch('email')}
            resetField={resetField}
            isInvalid={!!errors.email}
          />
          <AuthInput
            label={'비밀번호'}
            id="password"
            type="password"
            placeholder={'비밀번호를 입력하세요'}
            register={register('password', {
              required: '비밀번호를 입력해주세요.',
            })}
            inputValue={watch('password')}
            resetField={resetField}
            isInvalid={!!errors.password}
          />
          {errors.email?.type === 'required' && (
            <ErrorMessage>{`${errors.email?.message}`}</ErrorMessage>
          )}
          {!errors.email && errors.password?.type === 'required' && (
            <ErrorMessage>비밀번호를 입력해 주세요!</ErrorMessage>
          )}
          {!errors.email && !errors.password && isLoginFailed && (
            <>
              <ErrorMessage>
                이메일 또는 비밀번호를 잘못 입력했습니다.
              </ErrorMessage>
              <ErrorMessage>입력하신 내용을 다시 확인해주세요.</ErrorMessage>
            </>
          )}

          <SubmitBtn>로그인</SubmitBtn>
        </form>
      </div>

      <div className="mt-auto ">
        <div className="body6 mb-5 flex h-4 items-center gap-4 text-gray4">
          <hr className="flex-auto" />
          또는
          <hr className="flex-auto" />
        </div>
        <KakaoLoginButton />
        <SignupButton />
      </div>
    </div>
  );
};

export default Login;
