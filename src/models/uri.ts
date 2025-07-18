/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Entity, Index, JoinColumn, Column, PrimaryColumn, ManyToOne } from 'typeorm';

@Entity('uri')
export class Uri {
    @PrimaryColumn({ type: 'varchar', length: 32 })
    public id: string;

    @Column('text', {
        nullable: true,
    })
    public text: string | null;

	@Index({ unique: true })
	@Column('varchar', {
		length: 512, nullable: true,
	})
	public uriu: string | null;

	@Index({ unique: false })
	@Column('varchar', {
		length: 512, nullable: true,
	})
	public uri: string | null;
    
    constructor(data: Partial<Uri>) {
        if (data == null) return;

        for (const [k, v] of Object.entries(data)) {
            (this as any)[k] = v;
        }
    }
}
