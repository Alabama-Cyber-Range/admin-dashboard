import {
    useTheme,
    Table,
    TableCell,
    TableBody,
    TableHead,
    TableRow,
    Button,
  } from "@aws-amplify/ui-react";

  import { useSchoolUsers } from '../../hooks/useSchoolUsers';
  import { User } from '@admin-dashboard/contracts/User';
  import { useEffect } from "react";
  import { useNavigate } from "react-router-dom";
  import { unassociate_user_with_school } from "../../services/api";
  import { useQueryClient } from "@tanstack/react-query";

  export interface SchoolData {
    schoolId: number;
  }

  const UsersTable = (props: SchoolData) => {
    const { tokens } = useTheme();
    const schoolId  = props.schoolId;
    const data = useSchoolUsers(schoolId);
      useEffect(() => {}
      , [data, "schoolUsers"]);
    const navigate = useNavigate();

    const queryClient = useQueryClient()

    const handleDelete = async (userId: number) => {
      event?.preventDefault
      await unassociate_user_with_school(userId, schoolId);
      await queryClient.invalidateQueries({ queryKey: ['schoolUsers', schoolId] })
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
              <TableCell as="th">First Name</TableCell>
              <TableCell as="th">Last Name</TableCell>
              <TableCell as="th">Email</TableCell>
              <TableCell as="th">Cognito Username</TableCell>
              <TableCell as="th"></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data?.schoolUsers?.users?.sort((a, b) => a.first_name.localeCompare(b.first_name))?.map((item: User) => {
              return (
                <TableRow key={item.id}>
                  <TableCell
                    onClick={() => navigate(`/users/${item.id}`)}
                    style={{ cursor: "pointer" }}
                    >{item.first_name}
                  </TableCell>
                  <TableCell>{item.last_name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell
                  onClick={() => window.open(`https://us-east-1.console.aws.amazon.com/cognito/v2/idp/user-pools/us-east-1_EhL8P9jZQ/user-management/users/details/${item.cognito_id}?region=us-east-1`)}
                  style={{ cursor: "pointer" }}
                  >
                  {item.cognito_id}
              </TableCell>
              <TableCell>
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

  export default UsersTable;
