import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createRouteErrorResponse } from "@/lib/http/route-handlers";
import { ensureAdminApiSession } from "@/lib/permissions/session-permissions";
import { convertLeadToProject } from "@/lib/workflows/lead-conversion-workflow";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    ensureAdminApiSession(await auth());
    const { id } = await params;
    const result = await convertLeadToProject(id);

    return NextResponse.json({
      message: result.reused
        ? "Bu lead ucun artiq portal axini yaradilib."
        : "Lead proposal ve layihəyə cevrildi.",
      temporaryPassword: result.temporaryPassword,
      client: result.client
        ? {
            id: result.client._id.toString(),
            name: result.client.name,
            email: result.client.email,
          }
        : null,
      proposal: result.proposal
        ? {
            id: result.proposal._id.toString(),
            proposalNumber: result.proposal.proposalNumber,
          }
        : null,
      project: result.project
        ? {
            id: result.project._id.toString(),
            title: result.project.title,
          }
        : null,
      lead: {
        id: result.lead._id.toString(),
        clientUserId: result.lead.clientUserId?.toString() || null,
        proposalId: result.lead.proposalId?.toString() || null,
        projectId: result.lead.projectId?.toString() || null,
        convertedAt: result.lead.convertedAt,
        status: result.lead.status,
      },
    });
  } catch (error) {
    return createRouteErrorResponse("api/leads/[id]/convert.POST", error);
  }
}
