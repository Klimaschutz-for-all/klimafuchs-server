import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany, PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Quelle} from "./Quelle";
import {Oberthema} from "./Oberthema";
import {Challenge} from "./Challenge";
import {Props} from "./Props";
import {WikiImage} from "./WikiImage";
import {Kategorie} from "./Kategorie";
import {SeasonPlan} from "../game-state/SeasonPlan";
import {Field, Int, ObjectType} from "type-graphql";

@Entity()
@ObjectType()
export class Themenwoche{

    @Field(type => String)
    @PrimaryColumn()
    title: string;

    @Field(type => String)
    @Column({type: "text"})
    content: string;

    @Field(type => WikiImage)
    @ManyToOne(type => WikiImage, {eager: true})
    headerImage: WikiImage;

    @Field(type => Date)
    @CreateDateColumn()
    createdAt: Date;

    @Field(type => Date)
    @UpdateDateColumn()
    updatedAt: Date;

    @Field(type => Oberthema)
    @ManyToOne(type => Oberthema, o => o.themenWochen)
    oberthema: Promise<Oberthema>;

    @Field(type => Kategorie)
    @ManyToOne(type => Kategorie, k => k.themenWochen)
    kategorie: Promise<Kategorie>;

    @Field(type => [Challenge])
    @ManyToMany(type => Challenge, c => c.themenWoche)
    @JoinTable()
    challenges: Promise<Challenge[]>;

    @Field(type => Props)
    @ManyToOne(type => Props)
    props: Promise<Props>;

    @Field(type => Quelle)
    @ManyToMany(type => Quelle)
    @JoinTable()
    quellen: Promise<Quelle[]>;

    @Field(type => [SeasonPlan])
    @OneToMany(type => SeasonPlan, s => s.themenwoche)
    usages: Promise<SeasonPlan[]>;

    static fromTemplate(templateValues: any) {
        let themenWoche = new Themenwoche();
        themenWoche.title = templateValues.Titel;
        themenWoche.content = templateValues.Beschreibung;
        return themenWoche;
    }
}