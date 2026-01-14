import { Injectable } from "@nestjs/common";
import { MembershipsResponseDto } from "./dto/memberships-response.dto";
import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class MembershipsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(projectId: string) {
    const memberships = await this.prisma.membership.findMany({
      where: { projectId },
      include: {
        user: true,
      },
    });

    return memberships.map((membership) => ({
      id: membership.id,
      userId: membership.userId,
      name: membership.user.name ?? "",
      role: membership.role,
      createdAt: membership.createdAt,
      updatedAt: membership.updatedAt,
    }));
  }
}
