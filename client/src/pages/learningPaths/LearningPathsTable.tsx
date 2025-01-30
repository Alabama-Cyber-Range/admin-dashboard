import {
  useTheme,
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  Button,
} from "@aws-amplify/ui-react";

import { useLearningPaths } from '../../hooks/useLearningPaths';
import { LearningPath } from '@admin-dashboard/contracts/LearningPath';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { delete_learning_path } from "../../services/api"
import { useQueryClient } from "@tanstack/react-query";

const LearningPathsTable = () => {
  const { tokens } = useTheme();
  const data = useLearningPaths();
    useEffect(() => {}
    , [data]);
  const navigate = useNavigate();

  const queryClient = useQueryClient()

  const handleDelete = async (learningPathId: number) => {
    event?.preventDefault
    await delete_learning_path(learningPathId);
    await queryClient.invalidateQueries({ queryKey: ['learningPaths'] })
  };
  return (
    <>
      <Table
        caption=""
        highlightOnHover={true}
        backgroundColor={tokens.colors.background.primary.value}
        // variation="striped"
        >
        <TableHead>
          <TableRow>
            <TableCell as="th">Title</TableCell>
            <TableCell as="th">Description</TableCell>
            <TableCell as="th"></TableCell>
            <TableCell as="th"></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data?.learningPaths?.learningPaths?.sort((a, b) => a.name.localeCompare(b.name))?.map((item: LearningPath) => {
            return (
              <TableRow key={item.id}>
                <TableCell
                  onClick={() => navigate(`/learning-paths/${item.id}`)}
                  style={{ cursor: "pointer" }}
                  >{item.name}
                </TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>
                  <Button>Edit</Button>
                </TableCell>
                <TableCell>
                  <Button
                      onClick={() => handleDelete(Number(item.id))}>
                      Delete
                    </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default LearningPathsTable;
