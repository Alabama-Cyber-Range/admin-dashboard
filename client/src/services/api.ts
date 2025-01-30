import { generateClient } from 'aws-amplify/api';
import { LabsResponse } from '@admin-dashboard/contracts/Labs';
import { LabResponse } from '@admin-dashboard/contracts/Lab';
import { LearningPathsResponse } from '@admin-dashboard/contracts/LearningPaths';
import { LearningPathResponse } from '@admin-dashboard/contracts/LearningPath';
import { UserResponse } from '@admin-dashboard/contracts/User';
import { SchoolResponse } from '@admin-dashboard/contracts/School';
import { SchoolsResponse } from '@admin-dashboard/contracts/Schools';
import { UsersResponse } from '@admin-dashboard/contracts/Users';
import { fetchUserAttributes } from '@aws-amplify/auth';
import {
  listLabs,
  getLabs,
  listLearning_paths,
  getLearning_paths,
  listLearning_path_lab_associations,
  listSchool_lab_associations,
  getUsersByCognitoId,
  getUsers,
  listSchool_user_associations,
  getSchools,
  listSchools,
  listUsers,
} from '../graphql/queries';
import {
  createSchool_user_associations,
  createSchool_lab_associations,
  createLearning_path_lab_associations,
  deleteSchool_lab_associations,
  deleteLearning_path_lab_associations,
  deleteSchool_user_associations,
  createSchools,
  deleteSchools
} from '../graphql/mutations';
import {
  CreateSchool_user_associationsInput,
  CreateSchool_lab_associationsInput,
  CreateLearning_path_lab_associationsInput,
  DeleteSchool_lab_associationsInput,
  DeleteLearning_path_lab_associationsInput,
  DeleteSchool_user_associationsInput,
  CreateSchoolsInput,
  DeleteSchoolsInput,
} from '../API';

const client = generateClient();

export const get_user = async (): Promise<UserResponse> => {
  const attributes = await fetchUserAttributes();
  const cognito_id = attributes.sub!;
  const response = await client.graphql({ query: getUsersByCognitoId, variables: { cognito_id } });
  const user = response.data.getUsersByCognitoId;
  return { user: user ? { ...user, id: user.id.toString() } : null } as UserResponse;
}

export const get_user_by_id = async (id: number): Promise<UserResponse> => {
  const response = await client.graphql({ query: getUsers, variables: { id } });
  const user = response.data.getUsers;
  return { user: user ? { ...user, id: user.id.toString() } : null } as UserResponse;
}

export const get_labs = async (): Promise<LabsResponse> => {
  const response = await client.graphql({ query: listLabs });
  return { labs: response.data.listLabs?.items?.map((lab: any) => (
    { ...lab, id: lab.id.toString() })) ?? [] } as LabsResponse;
};

export const get_lab = async (id: number): Promise<LabResponse> => {
  const response = await client.graphql({ query: getLabs, variables: { id } });
  const lab = response.data.getLabs;
  return { lab: lab ? { ...lab, id: lab.id.toString() } : null } as LabResponse;
};

export const get_learning_paths = async (): Promise<LearningPathsResponse> => {
    const response = await client.graphql({ query: listLearning_paths });
    return { learningPaths: response.data.listLearning_paths?.items?.map((learningPaths: any) => (
      { ...learningPaths, id: learningPaths.id.toString() })) ?? [] } as LearningPathsResponse;
    };

export const get_schools = async (): Promise<SchoolsResponse> => {
    const response = await client.graphql({ query: listSchools });
    return { schools: response.data.listSchools?.items?.map((school: any) => (
      { ...school, id: school.id.toString() })) ?? [] } as SchoolsResponse;
    };

export const get_users = async (): Promise<UsersResponse> => {
    const response = await client.graphql({ query: listUsers });
    return { users: response.data.listUsers?.items?.map((user: any) => (
      { ...user, id: user.id.toString() })) ?? [], rooms: [] } as UsersResponse;
    };

export const get_school = async (id: number): Promise<SchoolResponse> => {
    const response = await client.graphql({ query: getSchools, variables: { id } });
    const schoolData = response.data.getSchools;
    if (!schoolData) {
        throw new Error('School not found');
    }
    return { school: { ...schoolData, id: schoolData.id.toString() } } as SchoolResponse;
    };

export const get_learning_path = async (id: number): Promise<LearningPathResponse> => {
    const response = await client.graphql({ query: getLearning_paths, variables: { id } });

    const learningPath = response.data.getLearning_paths;

    if (!learningPath) {
      throw new Error('Learning path not found');
    }

    // transform response data into desired shape
    return {
      learning_path: {
        ...learningPath,
        id: learningPath.id.toString(),
        name: learningPath.name,
        description: learningPath.description,
      },
    };
  }

export const get_path_labs = async (learningPathId: number): Promise<LabsResponse> => {

      // 1) Query associations, filtering by the desired learning path ID
      const associationResp = await client.graphql({
        query: listLearning_path_lab_associations,
        variables: {
          filter: {
            learning_path_id: { eq: learningPathId },
          },
        },
      });

      // Extract items safely
      const associations = associationResp?.data?.listLearning_path_lab_associations?.items ?? [];

      // 2) For each association, fetch the corresponding lab
      const labPromises = associations.map(async (assoc: any) => {
        const labResp = await client.graphql({
          query: getLabs,
          variables: { id: assoc.lab_id },
        });

        // Transform response data into desired shape
        const lab = labResp?.data?.getLabs;
        return {
          ...lab,
          id: lab?.id?.toString() ?? '',
          cloudshare_training_id: lab?.cloudshare_training_id ?? '',
          name: lab?.name ?? '',  // ensure name is a string
          description: lab?.description ?? '',  // ensure description is a string
          created_at: lab?.created_at ?? '',  // ensure created_at is a string
        };
      });

      // 3) Resolve all lab fetches
      const labs = await Promise.all(labPromises);

      // Return them in whatever structure your "LabsResponse" expects
      return { labs };
    };

export const get_school_labs = async (schoolId: number): Promise<LabsResponse> => {

      // 1) Query associations, filtering by the desired school ID
      const associationResp = await client.graphql({
        query: listSchool_lab_associations,
        variables: {
          filter: {
            school_id: { eq: schoolId },
          },
        },
      });

      // Extract items safely
      const associations = associationResp?.data?.listSchool_lab_associations?.items ?? [];

      // 2) For each association, fetch the corresponding lab
      const labPromises = associations.map(async (assoc: any) => {
        const labResp = await client.graphql({
          query: getLabs,
          variables: { id: assoc.lab_id },
        });

        // Transform the response data into desired shape
        const lab = labResp?.data?.getLabs;
        return {
          ...lab,
          id: lab?.id?.toString() ?? '',
          cloudshare_training_id: lab?.cloudshare_training_id ?? '',
          name: lab?.name ?? '',  // ensure name is a string
          description: lab?.description ?? '',  // ensure description is a string
          created_at: lab?.created_at ?? '',  // ensure created_at is a string
        };
      });

      // 3) Resolve all lab fetches
      const labs = await Promise.all(labPromises);

      // Return them in structure "LabsResponse" expects
      return { labs };
    };

export const get_user_school = async (): Promise<SchoolResponse> => {
  const attributes = await fetchUserAttributes();
  const cognito_id = attributes.sub!;
  const response = await client.graphql({ query: getUsersByCognitoId, variables: { cognito_id } });
  const user = response.data.getUsersByCognitoId;

  if (!user) {
    throw new Error('User not found');
  }

  const associationResp = await client.graphql({
    query: listSchool_user_associations,
    variables: {
      filter: {
        user_id: { eq: user.id },
      },
    },
  });

    // Extract items safely
    const associations = associationResp?.data?.listSchool_user_associations?.items ?? [];

    // 2) For each association, fetch the corresponding lab
    const schoolPromises = associations.map(async (assoc: any) => {
      const schoolResp = await client.graphql({
        query: getSchools,
        variables: { id: assoc.school_id },
      });

      // Transform the response data into desired shape
      const school = schoolResp?.data?.getSchools;
      return {
        ...school,
        id: school?.id?.toString() ?? '',
        name: school?.name ?? '',  // ensure name is a string
        created_at: school?.created_at ?? '',  // ensure created_at is a string
      };
    });

    // 3) Resolve all lab fetches
    const schools = await Promise.all(schoolPromises);

    // Return in structure "SchoolsPromise" expects
    return { school: schools[0] };
};

export const get_number_of_users = async (): Promise<number> => {
  let total = 0;
  let nextToken: string | undefined = undefined;

  do {
    // Pass `nextToken` as a variable to fetch the next page if available
    const response: any = await client.graphql({
      query: listUsers,
      variables: { nextToken },
    });

    const { items, nextToken: newNextToken } = response.data.listUsers ?? {};
    total += items?.length ?? 0;
    nextToken = newNextToken;

  } while (nextToken);

  return total;
};

export const get_number_of_labs = async (): Promise<number> => {
  const response = await client.graphql({ query: listLabs });
  return response.data.listLabs?.items?.length ?? 0;
};

export const get_number_of_schools = async (): Promise<number> => {
  const response = await client.graphql({ query: listSchools });
  return response.data.listSchools?.items?.length ?? 0;
};

export const get_user_school_by_id = async (userId: number): Promise<SchoolResponse> => {
  const associationResp = await client.graphql({
    query: listSchool_user_associations,
    variables: {
      filter: {
        user_id: { eq: userId },
      },
    },
  });

  // Extract items safely
  const associations = associationResp?.data?.listSchool_user_associations?.items ?? [];

  // 2) For each association, fetch the corresponding lab
  const schoolPromises = associations.map(async (assoc: any) => {
    const schoolResp = await client.graphql({
      query: getSchools,
      variables: { id: assoc.school_id },
    });

    // Transform the response data into desired shape
    const school = schoolResp?.data?.getSchools;
    return {
      ...school,
      id: school?.id?.toString() ?? '',
      name: school?.name ?? '',  // ensure name is a string
      created_at: school?.created_at ?? '',  // ensure created_at is a string
    };
  });

  // 3) Resolve all lab fetches
  const schools = await Promise.all(schoolPromises);

  // Return in structure "SchoolsPromise" expects
  return { school: schools[0] };
};

export const get_lab_schools = async (labId: number): Promise<SchoolsResponse> => {
  const associationResp = await client.graphql({
    query: listSchool_lab_associations,
    variables: {
      filter: {
        lab_id: { eq: labId },
      },
    },
  });

  // Extract items safely
  const associations = associationResp?.data?.listSchool_lab_associations?.items ?? [];

  // 2) For each association, fetch the corresponding lab
  const schoolPromises = associations.map(async (assoc: any) => {
    const schoolResp = await client.graphql({
      query: getSchools,
      variables: { id: assoc.school_id },
    });

    // Transform the response data into desired shape
    const school = schoolResp?.data?.getSchools;
    return {
      ...school,
      id: school?.id?.toString() ?? '',
      name: school?.name ?? '',  // ensure name is a string
      created_at: school?.created_at ?? '',  // ensure created_at is a string
    };
  });

  // 3) Resolve all lab fetches
  const schools = await Promise.all(schoolPromises);

  // Return in structure "SchoolsPromise" expects
  return { schools };
};

export const get_lab_learning_paths = async (labId: number): Promise<LearningPathsResponse> => {
  const associationResp = await client.graphql({
    query: listLearning_path_lab_associations,
    variables: {
      filter: {
        lab_id: { eq: labId },
      },
    },
  });

  // Extract items safely
  const associations = associationResp?.data?.listLearning_path_lab_associations?.items ?? [];

  // 2) For each association, fetch the corresponding lab
  const learningPathPromises = associations.map(async (assoc: any) => {
    const learningPathResp = await client.graphql({
      query: getLearning_paths,
      variables: { id: assoc.learning_path_id },
    });

    // Transform the response data into desired shape
    const learningPath = learningPathResp?.data?.getLearning_paths;
    return {
      ...learningPath,
      id: learningPath?.id?.toString() ?? '',
      name: learningPath?.name ?? '',  // ensure name is a string
      description: learningPath?.description ?? '',  // ensure description is a string
    };
  });

  // 3) Resolve all lab fetches
  const learningPaths = await Promise.all(learningPathPromises);

  // Return in structure "LearningPathsResponse" expects
  return { learningPaths };
};

export const get_school_users = async (schoolId: number): Promise<UsersResponse> => {
  const associationResp = await client.graphql({
    query: listSchool_user_associations,
    variables: {
      filter: {
        school_id: { eq: schoolId },
      },
    },
  });

  // Extract items safely
  const associations = associationResp?.data?.listSchool_user_associations?.items ?? [];

  // 2) For each association, fetch the corresponding lab
  const userPromises = associations.map(async (assoc: any) => {
    const userResp = await client.graphql({
      query: getUsers,
      variables: { id: assoc.user_id },
    });

    // Transform the response data into desired shape
    const user = userResp?.data?.getUsers;
    return {
      ...user,
      id: user?.id?.toString() ?? '',
      email: user?.email ?? '',  // ensure email is a string
      first_name: user?.first_name ?? '',  // ensure first_name is a string
      last_name: user?.last_name ?? '',  // ensure last_name is a string
      created_at: user?.created_at ?? '',  // ensure created_at is a string
      cognito_id: user?.cognito_id ?? '',  // ensure cognito_id is a string
    };
  });

  // 3) Resolve all lab fetches
  const users = await Promise.all(userPromises);

  // Return in structure "UsersResponse" expects
  return { users };
};

export const get_user_schools = async (userId: number): Promise<SchoolsResponse> => {
  const associationResp = await client.graphql({
    query: listSchool_user_associations,
    variables: {
      filter: {
        user_id: { eq: userId },
      },
    },
  });

  // Extract items safely
  const associations = associationResp?.data?.listSchool_user_associations?.items ?? [];

  // 2) For each association, fetch the corresponding lab
  const schoolPromises = associations.map(async (assoc: any) => {
    const schoolResp = await client.graphql({
      query: getSchools,
      variables: { id: assoc.school_id },
    });

    // Transform the response data into desired shape
    const school = schoolResp?.data?.getSchools;
    return {
      ...school,
      id: school?.id?.toString() ?? '',
      name: school?.name ?? '',  // ensure name is a string
      created_at: school?.created_at ?? '',  // ensure created_at is a string
    };
  });

  // 3) Resolve all lab fetches
  const schools = await Promise.all(schoolPromises);

  // Return in structure "SchoolsPromise" expects
  return { schools };
};

export const associate_user_with_school = async (userId: number, schoolId: number): Promise<void> => {
  const input: CreateSchool_user_associationsInput = {
    user_id: userId,
    school_id: schoolId,
  };

  await client.graphql({
    query: createSchool_user_associations,
    variables: { input },
  });
};

export const unassociate_user_with_school = async (userId: number, schoolId: number): Promise<void> => {
  const user = get_user_by_id(userId);
  const user_id = Number((await user).user.id);

  const associationResp = await client.graphql({
    query: listSchool_user_associations,
    variables: {
      filter: {
        user_id: { eq: user_id },
        school_id: { eq: schoolId },
      },
    },
  });

  // Extract items safely
  const associations = associationResp?.data?.listSchool_user_associations?.items ?? [];

  if (!associations[0]) {
    throw new Error('No associations found for the given user ID');
  }

  const input: DeleteSchool_user_associationsInput = {
    id: associations[0].id,
  };

  await client.graphql({
    query: deleteSchool_user_associations,
    variables: { input },
  });
};

export const associate_lab_with_school = async (labId: number, schoolId: number): Promise<void> => {
  const input: CreateSchool_lab_associationsInput = {
    lab_id: labId,
    school_id: schoolId,
  };

  await client.graphql({
    query: createSchool_lab_associations,
    variables: { input },
  });
};

export const unassociate_lab_with_school = async (labId: number, schoolId: number): Promise<void> => {
  const lab = get_lab(labId);
  const lab_id = Number((await lab).lab.id);

  const associationResp = await client.graphql({
    query: listSchool_lab_associations,
    variables: {
      filter: {
        lab_id: { eq: lab_id },
        school_id: { eq: schoolId },
      },
    },
  });

  // Extract items safely
  const associations = associationResp?.data?.listSchool_lab_associations?.items ?? [];

  if (!associations[0]) {
    throw new Error('No associations found for the given lab ID');
  }

  const input: DeleteSchool_lab_associationsInput = {
    id: associations[0].id,
  };

  await client.graphql({
    query: deleteSchool_lab_associations,
    variables: { input },
  });
};

export const associate_lab_with_learning_path = async (labId: number, learningPathId: number): Promise<void> => {
  const input: CreateLearning_path_lab_associationsInput = {
    lab_id: labId,
    learning_path_id: learningPathId,
  };

  await client.graphql({
    query: createLearning_path_lab_associations,
    variables: { input },
  });
};

export const unassociate_lab_with_learning_path = async (labId: number, learningPathId: number): Promise<void> => {
  const lab = get_lab(labId);
  const lab_id = Number((await lab).lab.id);

  const associationResp = await client.graphql({
    query: listLearning_path_lab_associations,
    variables: {
      filter: {
        lab_id: { eq: lab_id },
        learning_path_id: { eq: learningPathId },
      },
    },
  });

  // Extract items safely
  const associations = associationResp?.data?.listLearning_path_lab_associations?.items ?? [];

  if (!associations[0]) {
    throw new Error('No associations found for the given lab ID');
  }

  const input: DeleteLearning_path_lab_associationsInput = {
    id: associations[0].id,
  };

  await client.graphql({
    query: deleteLearning_path_lab_associations,
    variables: { input },
  });
};

export const create_school = async (name: string): Promise<void> => {
  const input: CreateSchoolsInput = {
    name,
  };

  await client.graphql({
    query: createSchools,
    variables: { input },
  });
};

export const delete_school = async (schoolId: number): Promise<void> => {
  const school = get_school(schoolId);
  const school_id = Number((await school).school.id);

  const input: DeleteSchoolsInput = {
    id: school_id,
  };

  await client.graphql({
    query: deleteSchools,
    variables: { input },
  });
};
