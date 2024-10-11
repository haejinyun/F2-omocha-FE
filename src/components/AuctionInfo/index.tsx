import { useEffect, useRef, useState } from 'react';

import useDeleteBasicAuction from '@/apis/queryHooks/basicAuction/useDeleteBasicAuction';
import usePostBasicAuctionBid from '@/apis/queryHooks/basicAuction/usePostBasicAuctionBid';
import ChevronDownIcon from '@/assets/svg/chevron-down.svg';
import ChevronUpIcon from '@/assets/svg/chevron-up.svg';
import AuctionBidConfirmModal from '@/components/AuctionInfo/AuctionBidConfirmModal';
import AuctionBidListModal from '@/components/AuctionInfo/AuctionBidListModal';
import AuctionCountdown from '@/components/AuctionInfo/AuctionCountdown';
import { Modal } from '@/components/Modal/Modal';
import ModalFooter from '@/components/Modal/ModalFooter';
import useBooleanState from '@/hooks/useBooleanState';
import { useAuth } from '@/provider/authProvider';

import AuctionDeleteConfirmModal from './AuctionDeleteConfirmModal';
import * as S from './AuctionInfo.css';

interface AuctionInfoProps {
  id: number;
  title: string;
  startPrice: number;
  nowPrice?: number; // nowPrice는 선택적
  endTime: string;
  bidCount: number;
  bidUnit: number;
}

const SAMPLE_MEMBER_ID = 12;
const SAMPLE_AUTHOR_ID = 12;

function AuctionInfo(SAMPLE: AuctionInfoProps) {
  const { token } = useAuth();
  const { id, title, startPrice, nowPrice, bidCount, endTime, bidUnit } = SAMPLE;
  const { mutate: postBidMutate } = usePostBasicAuctionBid();
  const { mutate: deleteAuctionMutate } = useDeleteBasicAuction();

  const [expired, setExpired] = useState(false);
  const bidInputRef = useRef<HTMLInputElement>(null);

  const {
    value: isOpenBidListModal,
    toggle: setIsOpenBidListModal,
    setTrue: openBidListModal,
  } = useBooleanState();

  const {
    value: isOpenBidConfirmModal,
    toggle: setIsOpenBidConfirmModal,
    setTrue: openBidConfirmModal,
  } = useBooleanState();

  const {
    value: isOpenDeleteConfirmModal,
    toggle: setIsOpenDeleteConfirmModal,
    setTrue: openDeleteConfirmModal,
  } = useBooleanState();

  useEffect(() => {
    if (bidInputRef.current && nowPrice) {
      bidInputRef.current.value = String(nowPrice + bidUnit);
    } else if (bidInputRef.current && startPrice) {
      bidInputRef.current.value = String(startPrice);
    }
  }, [nowPrice, startPrice]);

  const handleBidButton = () => {
    if (bidInputRef.current) {
      const bidAmount = bidInputRef.current.value;

      postBidMutate({
        id,
        params: {
          bid_price: Number(bidAmount),
        },
      });
    }
    setIsOpenBidConfirmModal();
  };

  const handleBidPriceDown = () => {
    const bidInput = Number(bidInputRef.current?.value);
    let currentBid = bidInput;
    if (nowPrice && bidInput - bidUnit >= nowPrice) {
      currentBid -= bidUnit;
    } else if (bidInput - bidUnit >= startPrice) {
      currentBid -= bidUnit;
    }

    if (currentBid >= nowPrice! + bidUnit && bidInputRef.current) {
      bidInputRef.current.value = String(currentBid);
    }
  };

  const canNotBid = () => {
    if (expired) {
      return '경매 진행 기간이 아닙니다.';
    }
    if (!token) {
      return '로그인 후 사용 가능한 서비스입니다.';
    }
    return '';
  };

  const canDelete = SAMPLE_MEMBER_ID === SAMPLE_AUTHOR_ID;

  return (
    <div className={S.infoWrapper}>
      <div className={S.infoTitle}>{title}</div>
      <div className={S.infoRow}>
        <span className={S.infoRowTitle}>시작가</span>
        <span>
          {startPrice.toLocaleString('ko-KR')}
          <span>원</span>
        </span>
      </div>
      <div className={`${S.infoRow} ${S.nowPrice}`}>
        <span className={S.infoRowTitle}>현재가</span>
        <span>
          {nowPrice && nowPrice.toLocaleString('ko-KR')}
          <span>원</span>
        </span>
      </div>
      <hr className={S.division} />
      <div className={S.infoRow}>
        <span className={S.infoRowTitle}>남은 시간</span>
        <AuctionCountdown endTime={endTime} setExpired={setExpired} />
      </div>
      <div className={S.endTimeDescription}>{endTime}</div>
      <div className={S.infoRow}>
        <span className={S.infoRowTitle}>입찰 기록</span>
        <div className={S.infoRight}>
          <span>{bidCount}회</span>
          <button type="button" className={S.infoButton} onClick={openBidListModal}>
            기록 보기
          </button>
        </div>
        <Modal isOpen={isOpenBidListModal} onOpenChange={setIsOpenBidListModal}>
          <AuctionBidListModal id={id} />
        </Modal>
      </div>
      <div className={S.infoRow}>
        <span className={S.infoRowTitle}>입찰 단위</span>
        <div className={S.infoRight}>
          <span>{`${bidUnit} 원`}</span>
        </div>
        <Modal isOpen={isOpenBidListModal} onOpenChange={setIsOpenBidListModal}>
          <AuctionBidListModal id={id} />
        </Modal>
      </div>
      <div className={S.infoRow}>
        <span className={S.infoRowTitle}>입찰 희망가</span>
        <div className={S.infoRight}>
          <input type="number" ref={bidInputRef} disabled />
          <span>원</span>
          <div>
            <button
              className={S.bidPriceButton}
              type="button"
              onClick={() => {
                if (bidInputRef.current) {
                  const newBidInput = Number(bidInputRef.current.value) + bidUnit;
                  bidInputRef.current.value = newBidInput.toString();
                }
              }}
            >
              <ChevronUpIcon />
            </button>
            <button className={S.bidPriceButton} type="button" onClick={handleBidPriceDown}>
              <ChevronDownIcon />
            </button>
          </div>
        </div>
      </div>

      {canDelete ? (
        <button
          type="button"
          disabled={bidCount > 0}
          className={bidCount > 0 ? S.deleteButton.disabled : S.deleteButton.default}
          onClick={openDeleteConfirmModal}
        >
          삭제하기
          {bidCount > 0 && (
            <p className={S.bidButtonExplain}>현재 입찰이 걸려 게시글을 삭제할 수 없습니다.</p>
          )}
        </button>
      ) : (
        <button
          disabled={expired || !token}
          type="button"
          className={expired || !token ? S.bidButton.disabled : S.bidButton.default}
          onClick={openBidConfirmModal}
        >
          입찰하기
          <p className={S.bidButtonExplain}>{canNotBid()}</p>
        </button>
      )}
      <ModalFooter
        isOpen={isOpenBidConfirmModal}
        onOpenChange={setIsOpenBidConfirmModal}
        positiveButton="확인"
        positiveButtonEvent={handleBidButton}
      >
        <AuctionBidConfirmModal bidPrice={bidInputRef?.current?.value} />
      </ModalFooter>
      <ModalFooter
        isOpen={isOpenDeleteConfirmModal}
        onOpenChange={setIsOpenDeleteConfirmModal}
        positiveButton="삭제"
        positiveButtonEvent={() => deleteAuctionMutate(id)}
      >
        <AuctionDeleteConfirmModal />
      </ModalFooter>
    </div>
  );
}

export default AuctionInfo;
