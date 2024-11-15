import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { postAuctionQnA } from '@/apis/queryFunctions/basicAuction';
import { PostAuctionQnAParams, PostAuctionQnAResponseData } from '@/apis/types/basicAuction';
import { Response } from '@/apis/types/common';
import { useToast } from '@/provider/toastProvider';

function usePostBasicAuctionQnA() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutate, error } = useMutation({
    mutationFn: (data: PostAuctionQnAParams) => postAuctionQnA(data),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: ['auctionQnAList', params.auction_id] });
      showToast('success', 'QnA 답변 등록에 성공했습니다.');
    },
    onError: (e: AxiosError<Response<PostAuctionQnAResponseData>>) => {
      if (e.response) {
        showToast('error', `${e.response.data.result_msg}`);
      } else {
        showToast('error', '알 수 없는 오류가 발생했습니다. 새로고침을 진행해 주세요.');
      }
    },
  });
  return { mutate, error };
}

export default usePostBasicAuctionQnA;
