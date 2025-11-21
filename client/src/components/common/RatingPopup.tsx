import React, { useState } from "react";
import styled from "styled-components";
import { Star } from "react-feather";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const PopupBox = styled.div`
  width: 480px;
  background: #ffffff;
  border-radius: 16px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const Title = styled.h2`
  margin: 0;
  font-size: 26px;
  font-weight: 800;
  color: #27374d;
`;

const Description = styled.p`
  margin: 0;
  color: #555;
  font-size: 16px;
`;

const StarsRow = styled.div`
  display: flex;
  gap: 12px;
`;

const StarButton = styled.div`
  cursor: pointer;
  transition: color 0.2s;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  border: 1px solid #ddd;
  min-height: 100px;
  resize: none;
  font-size: 16px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  align-items: center;
`;

const PrimaryButton = styled.button`
  background: #27374d;
  color: white;
  padding: 12px 24px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
`;

const SecondaryButton = styled.button`
  background: #e5e5e5;
  color: #333;
  padding: 12px 24px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
`;

const DeleteButton = styled.button`
  background: #ffe5e5;
  color: #b00000;
  padding: 10px 18px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  margin-right: auto;
`;

interface Props {
  businessId: string;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  onDelete?: () => void;
  initialRating?: number | null;
  initialComment?: string;
}

const RatingPopup: React.FC<Props> = ({
  businessId,
  onClose,
  onSubmit,
  onDelete,
  initialRating = 0,
  initialComment = "",
}) => {
  // ⭐ FIXED: rating is ALWAYS a number
  const [rating, setRating] = useState<number>(initialRating ?? 0);
  const [comment, setComment] = useState(initialComment);

  const isEditing = (initialRating ?? 0) > 0;

  return (
    <Overlay>
      <PopupBox>
        <Title>{isEditing ? "Edit Your Rating" : "Rate Your Experience"}</Title>
        <Description>
          {isEditing
            ? "Update your rating or edit your review for this salon."
            : "Please rate this salon out of 5 stars."}
        </Description>

        {/* STAR SELECTION */}
        <StarsRow>
          {[1, 2, 3, 4, 5].map((num) => {
            const active = num <= rating;
            return (
              <StarButton key={num} onClick={() => setRating(num)}>
                <Star
                  size={35}
                  color={active ? "#FFD700" : "#ccc"}
                  fill={active ? "#FFD700" : "none"}
                />
              </StarButton>
            );
          })}
        </StarsRow>

        {/* COMMENT */}
        <TextArea
          placeholder="Write your review (optional)..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <ButtonRow>
          {onDelete && isEditing && (
            <DeleteButton
              type="button"
              onClick={() => {
                if (window.confirm("Delete your review for this salon?")) {
                  onDelete();
                }
              }}
            >
              Delete Review
            </DeleteButton>
          )}

          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>

          <PrimaryButton
            onClick={() => {
              if (rating < 1) {
                alert("Please select at least 1 star");
                return;
              }
              onSubmit(rating, comment);
            }}
          >
            {isEditing ? "Save Changes" : "Submit Review"}
          </PrimaryButton>
        </ButtonRow>
      </PopupBox>
    </Overlay>
  );
};

export default RatingPopup;
