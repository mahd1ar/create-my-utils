
// read

import { config } from '@keystone-6/core';
import { lists } from './schema';
import { withAuth, session } from './auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


async function getAdminSessionParams() {
    prisma.$connect();

    const user = await prisma.user.findFirst({
        where: {
            // role: {
            //     equals: Roles.admin,
            // },
            // status: { equals: 'enable' },
            email: {
                equals: 'a.mahdiyar7@yahoo.com'
            }
        },
    });

    prisma.$disconnect();

    return {
        listKey: 'User',
        itemId: user?.id || '',
        data: {
            createdAt: user?.createdAt?.toString() || '',
            name: user?.name || '',
            // status: 'enable',
            // ..wathever
        },
    };
}


export default withAuth(
    config({
        db: {
            provider: 'sqlite',
            url: 'file:./keystone.db',
        },
        lists,
        session,
        server: {
            port: 5505,
            cors: {
                origin: 'http://localhost:3000',
                credentials: true,
            },
            extendExpressApp(app, ctx) {
                app.post('/auth', async (req, res) => {

                    const adminData = await getAdminSessionParams()

                    const reqCtx = await ctx.withRequest(req, res)
                    const sessionToken = await reqCtx.sessionStrategy?.start({
                        context: reqCtx,
                        data: adminData
                    })


                    console.log({ sessionToken })

                    // ctx.sessionStrategy?.end({ context: adminContext });
                    res.json({ ok: 1 })
                })

                app.get('/auth', async (req, res) => {
                    const contex = await ctx.withRequest(req, res)
                    console.log(contex.session)
                    res.json({ ok: 2 })
                })
            },
        }
    })
);
