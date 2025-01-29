import {
  useTheme,
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  Button,
} from "@aws-amplify/ui-react";

import { useTargetUserSchools } from '../../hooks/useTargetUserSchools';
import { School } from '@admin-dashboard/contracts/School';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { unassociate_user_with_school } from "../../services/api"
import { useQueryClient } from "@tanstack/react-query";

export interface UserData {
  userId: number;
}

const SchoolsTable = (props: UserData) => {
  const { tokens } = useTheme();
  const userId  = props.userId;
  const data = useTargetUserSchools(userId);
    useEffect(() => {}
    , [data]);
  const navigate = useNavigate();

  const queryClient = useQueryClient()

  const handleDelete = async (schoolId: number) => {
    event?.preventDefault
    await unassociate_user_with_school(userId, schoolId);
    await queryClient.invalidateQueries({ queryKey: ['userSchools', userId] })
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
            <TableCell as="th">Name</TableCell>
            <TableCell as="th" align="right"></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data?.schools?.sort((a, b) => a.name.localeCompare(b.name))?.map((item: School) => {
            return (
              <TableRow key={item.id}>
                <TableCell
                  onClick={() => navigate(`/schools/${item.id}`)}
                  style={{ cursor: "pointer" }}
                  >{item.name}
                </TableCell>
                <TableCell align="right" style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    onClick={() => handleDelete(Number(item.id))}
                    >Unassociate
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

export default SchoolsTable;
