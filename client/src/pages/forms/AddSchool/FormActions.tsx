import { Button } from "@aws-amplify/ui-react";
import { create_school } from "../../../services/api";

interface FormActionsProps {
  formOnSubmit: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
}

const FormActions = (props: FormActionsProps) => {
  // const { formOnSubmit, isLoading, isDisabled } = props;
  const { formOnSubmit, isLoading = false, isDisabled = false } = props;
  create_school("Test School");

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    formOnSubmit();
    e.preventDefault();
  };

  return (
    <>
      <Button width="100%" marginTop="20px">
        Preview
      </Button>
      <Button
        type="submit"
        variation="primary"
        width="100%"
        marginTop="20px"
        onClick={handleSubmit}
        isLoading={isLoading}
        loadingText="Loading..."
        isDisabled={isDisabled}
      >
        Save
      </Button>
    </>
  );
};

export default FormActions;
