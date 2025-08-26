import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class GradesService {
  async create(data: any, professorId: number) {
    if (!data.studentName || !data.subject || data.grade == null) {
      throw new Error('Missing required fields: studentName, subject, grade')
    }
    return prisma.grade.create({
      data: {
        studentName: data.studentName,
        subject: data.subject,
        grade: data.grade,
        professorId,
      },
    })
  }

  async findByStudent(studentName: string) {
    return prisma.grade.findMany({ where: { studentName } })
  }

  async update(gradeId: number, grade: number) {
    return prisma.grade.update({
      where: { id: gradeId },
      data: { grade },
    })
  }

  async delete(gradeId: number) {
    return prisma.grade.delete({ where: { id: gradeId } })
  }
}
