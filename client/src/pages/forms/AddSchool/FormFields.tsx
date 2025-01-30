import React from "react";
import {
  Flex,
  Text,
  TextField,
} from "@aws-amplify/ui-react";

interface Fields {
  name: string;
}

interface FormFieldProps {
  formFieldChange: (name: string, value: string) => void;
  formFieldIsValid: (valid: boolean) => void;
  values: Fields;
}

const FormFields = (props: FormFieldProps) => {
  const [titleHasError, setTitleHasError] = React.useState(true);
  const { values, formFieldChange, formFieldIsValid } = props;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    formFieldChange(e.target.name, e.target.value);
  };

  const validateTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isEmpty = /^\s*$/.test(e.target.value);
    setTitleHasError(isEmpty);
    formFieldIsValid(!isEmpty);
  };

  return (
    <>
      <Flex direction="column" width="100%">
        <TextField
          value={values.name}
          onChange={(e) => {
            handleInputChange(e);
            validateTitle(e);
          }}
          name="name"
          hasError={titleHasError}
          errorMessage="Please input a school"
          label={
            <Text>
              School
              <Text as="span" fontSize="0.8rem" color="red">
                (required)
              </Text>
            </Text>
          }
          type="text"
          isRequired={true}
        />

      </Flex>
    </>
  );
};

export default FormFields;
