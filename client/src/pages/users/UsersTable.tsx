import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  useTheme,
} from "@aws-amplify/ui-react";

import { useUsers } from "../../hooks/useUsers";
import { User } from '@admin-dashboard/contracts/User';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UsersTable = () => {
  const { tokens } = useTheme();
  const data = useUsers();
    useEffect(() => {}
    , [data]);
  const navigate = useNavigate();
  return (
    <>
      <Table
        backgroundColor={tokens.colors.background.primary.value}
        caption=""
        highlightOnHover={true}
        // variation="striped"
        >
        <TableHead>
          <TableRow>
            <TableCell as="th">First Name</TableCell>
            <TableCell as="th">Last Name</TableCell>
            <TableCell as="th">Email</TableCell>
            <TableCell as="th">Cognito Username</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.users?.users?.sort((a, b) => a.first_name.localeCompare(b.first_name))?.map((item: User) => {
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
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default UsersTable;
