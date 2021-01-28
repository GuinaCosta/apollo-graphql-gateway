import { gql } from "apollo-server-express";

export const typeDefs = gql`
  extend type Query {
    student(id: Int!): Student
    students: [Student]
  }

  type Student @key(fields: "id") {
    id: Int!
    name: String!
    courses: [Course]
  }

  extend type Course @key(fields: "id") {
    id: Int! @external
  }
`;

const students = {
  1: { name: "sutudent 1", courses: [1, 2] },
  2: { name: "sutudent 2", courses: [1, 3] },
  3: { name: "sutudent 3", courses: [3, 2] },
  4: { name: "sutudent 4", courses: [1, 3] },
  5: { name: "sutudent 5", courses: [1, 3] },
  6: { name: "sutudent 6", courses: [2, 3] },
  7: { name: "sutudent 7", courses: [2, 3] },
  8: { name: "sutudent 8", courses: [1, 2] },
  9: { name: "sutudent 9", courses: [1, 2] },
  10: { name: "sutudent 10", courses: [2, 3] },
  11: { name: "sutudent 11", courses: [1, 3] },
}

export const resolvers = {
  Student: {
    courses(student) {
      return student.courses.map((id) => ({ __typename: "Course", id }));
    },
    __resolveReference(ref) {
      const student = students[ref.id];
      if (student === undefined)
        throw new Error(`Student ${ref.id} not found`);
      
      return { 
        id: ref.id,
        name: student.name,
        courses: student.courses
      };
    }
  },

  Query: {
    student: async (_, { id }, context) => {
      const student = students[id];
      if (student === undefined)
        throw new Error(`Student ${id} not found`);
      
      return {
        id,
        name: student.name,
        courses: student.courses
      };
    },
    students: async (_, {}, context) => {
      return Object.entries(students).map((x) => {
        const v = x[1];

        return { id: x[0], name: v.name, courses: v.courses };
      });
    },
  },
};
