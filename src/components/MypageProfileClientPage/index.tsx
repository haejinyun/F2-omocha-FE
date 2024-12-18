'use client';

import { UserIcon } from 'lucide-react';
import Image from 'next/image';

import useGetUser from '@/apis/queryHooks/User/useGetUser';
import CommonInput from '@/components/CommonInput';
import { Modal } from '@/components/Modal/Modal';
import ImageUploadModal from '@/components/MypageProfileClientPage/components/ImageUploadModal';
import useBooleanState from '@/hooks/useBooleanState';
import colors from '@/styles/color';

import * as S from './MypageProfileClientPage.css';

// 닉네임 추후 추가 예정
function MypageProfileClientPage() {
  const { data: user } = useGetUser();

  const { value: isOpenImageUploadModal, toggle: setIsOpenImageUploadModal } = useBooleanState();

  return (
    <>
      <div className={S.image}>
        <button type="button" onClick={setIsOpenImageUploadModal} className={S.imageButton}>
          {user?.profile_image_url ? (
            <Image
              className={S.profileImage}
              src={`${process.env.NEXT_PUBLIC_S3_URL}${user.profile_image_url}`}
              width={100}
              height={100}
              priority
              alt="프로필 이미지"
            />
          ) : (
            <UserIcon size={100} strokeWidth={1} stroke={colors.gray5} />
          )}
        </button>
      </div>
      <Modal isOpen={isOpenImageUploadModal} onOpenChange={setIsOpenImageUploadModal}>
        <ImageUploadModal
          defaultImage={user?.profile_image_url}
          onClose={setIsOpenImageUploadModal}
        />
      </Modal>
      <CommonInput label="아이디" id="email" value={user?.email} disabled />
      {/* <CommonInput label="닉네임" id="nickname" value={user?.nick_name} disabled /> */}
    </>
  );
}

export default MypageProfileClientPage;
