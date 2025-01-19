import {
    View,
    Flex,
    // useTheme,
    Table,
    TableCell,
    TableBody,
    TableHead,
    TableRow,
    Text,
    Button,
} from "@aws-amplify/ui-react";
import { useParams } from 'react-router-dom';
import { useLearningPath } from "../../hooks/useLearningPath";
import { usePathLabs } from "../../hooks/usePathLabs";
// import { useNavigate } from "react-router-dom";

const LearningPath = () => {
//   const { tokens } = useTheme();
  const { pathId = '' } = useParams<{ pathId: string }>()
  const learningPath = useLearningPath(pathId);
  const modules = usePathLabs(Number(pathId));
//   const navigate = useNavigate();
  return (
    <>
    <View maxWidth="100%" padding="0rem" minHeight="100vh">
      <Flex
        direction={{ base: "column", large: "row" }}
        alignItems="flex-start"
      >
        <div className="profile-header-text">
          <Text variation="primary" fontWeight={600} fontSize="18px">
            {learningPath?.learning_path?.name}
          </Text>
          <Text variation="tertiary">{learningPath?.learning_path?.description}</Text>
        </div>
      </Flex>
        <Table
          caption=""
          highlightOnHover={true}
          variation="striped"
        >
            <TableHead>
                <TableRow>
                <TableCell as="th">Module</TableCell>
                <TableCell as="th">Description</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {modules?.labs?.labs?.sort((a, b) => a.name.localeCompare(b.name))?.map((module) => {
                return (
                    <TableRow key={module.id}>
                    <TableCell>{module.name}</TableCell>
                    <TableCell>{module.description}</TableCell>
                    <TableCell>
                        <Button>Remove</Button>
                    </TableCell>
                    </TableRow>
                );
                })}
            </TableBody>
        </Table>
      </View>
    </>
  );
};

export default LearningPath;