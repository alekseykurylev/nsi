import {cache} from 'react'
import prisma from '@/lib/prisma'

export const getOKPD = cache(async () => {
    return prisma.okpd2.findMany();
})