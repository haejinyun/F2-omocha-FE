import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { postAuctionLike } from '@/apis/queryFunctions/basicAuction';
import { PostLikeParams } from '@/apis/types/basicAuction';
import { Response } from '@/apis/types/common';
import { useToast } from '@/provider/toastProvider';

function usePostAuctionLike(id: number, isLike: boolean) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutate, error } = useMutation({
    mutationFn: (param: PostLikeParams) => postAuctionLike(id, param),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctionLikeList'] });
      queryClient.invalidateQueries({ queryKey: ['basicAuctionList'] });
      queryClient.invalidateQueries({ queryKey: ['basicAuction', id] });

      if (isLike) {
        showToast('success', '찜 목록에서 삭제되었습니다.');
      } else {
        showToast('success', '찜 등록에 성공했습니다.');
      }
    },
    onError: (e: AxiosError<Response<string>>) => {
      if (e.response) {
        showToast('error', `${e.response.data.result_msg}`);
      } else {
        showToast('error', '알 수 없는 오류가 발생했습니다. 새로고침을 진행해 주세요.');
      }
    },
  });

  return { mutate, error };
}

export default usePostAuctionLike;
