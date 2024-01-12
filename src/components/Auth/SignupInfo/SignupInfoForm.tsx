import { SubmitHandler, useForm } from 'react-hook-form';
import UserInfoImg from './UserInfoImg';
import { putMember } from '@api/member';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { UserInfoState } from '@recoil/Auth.atom';
import { useEffect } from 'react';
import SubmitBtn from '@components/common/button/SubmitBtn';
import AuthDropDown from './AuthDropDown/AuthDropDown';
import AuthNicknameInputBox from '../AuthInput/AuthInputBox/AuthNicknameInputBox';

const SignupInfoForm = () => {
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    resetField,
    setError,
    setValue,
    formState: { errors, isValid },
  } = useForm<any>({
    mode: 'onChange',
    criteriaMode: 'all',
  });
  const navigate = useNavigate();

  const userInfo = useRecoilValue(UserInfoState);
  useEffect(() => {
    setValue('nickname', userInfo?.nickname);
  }, [userInfo]);

  const onInfoSubmit: SubmitHandler<any> = async (data) => {
    const { nickname } = data;

    try {
      const res = await putMember({
        nickname: nickname,
        profileImageUrl: '',
        ageType: null,
        genderType: null,
      });
      if (res.status === 200) {
        navigate('/');
      }
    } catch (err) {
      console.error('회원정보 수정 요청 중 에러 발생', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onInfoSubmit)} className="w-full">
      <div>
        <div className="mb-10">
          <UserInfoImg />
        </div>
        <AuthNicknameInputBox
          register={register}
          inputValue={watch('nickname')}
          resetField={resetField}
          errors={errors}
          setError={setError}
          getValues={getValues}
        />
        <div className="flex flex-col gap-6">
          <AuthDropDown
            label="성별"
            text={'성별을 선택해주세요.'}
            options={genderArr}
          />
          <AuthDropDown
            label="연령대"
            text={'연령대를 선택해주세요.'}
            options={ageArr}
          />
        </div>
      </div>
      <div className="mt-auto">
        <SubmitBtn isActive={isValid}>완료</SubmitBtn>
      </div>
    </form>
  );
};

export default SignupInfoForm;

const genderArr: SelectOption[] = [
  { id: '1', value: '여' },
  { id: '2', value: '남' },
  { id: '3', value: '기타' },
];

const ageArr: SelectOption[] = [
  { id: '1', value: '10대' },
  { id: '2', value: '20대' },
  { id: '3', value: '30대' },
  { id: '4', value: '40대' },
  { id: '5', value: '50대 이상' },
];
