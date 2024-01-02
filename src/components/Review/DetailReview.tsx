import { getToursReviews } from '@api/tours';
import { useQuery } from '@tanstack/react-query';
import ReviewItem from '@components/DetailSectionBottom/ReviewItem';
import { useParams } from 'react-router-dom';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { isModalOpenState, titleState } from '@recoil/modal';
import { Modal } from '@components/common/modal';

export default function DetailReview() {
  const params = useParams();
  const tourId = Number(params.id);
  const [isModalOpen, setIsModalOpen] = useRecoilState(isModalOpenState);
  const setTitle = useSetRecoilState(titleState);

  const { data: toursReviews } = useQuery({
    queryKey: ['toursReviews'],
    queryFn: () => getToursReviews(tourId),
  });

  const selectedReview = toursReviews?.data?.data?.reviewInfos.filter(
    (item: any) => item.reviewId.toString() === tourId,
  );

  const openModal = (title: string) => {
    setTitle(title);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="mb-6 ">
      {selectedReview?.map((item: any) => (
        <ReviewItem
          key={item.reviewId}
          authorNickname={item.authorNickname}
          authorProfileImageUrl={item.authorProfileImageUrl}
          rating={item.rating}
          createdTime={item.createdTime}
          content={item.content}
          keywords={item.keywords} // keywordId, content, type
          commentCount={2} // commentCount가 swagger에는 있는데 response에는 없음
          onClick={() => openModal('내 리뷰')}
        />
      ))}
      <Modal isOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
}
