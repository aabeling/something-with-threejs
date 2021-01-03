import { BoxBufferGeometry, Color, DoubleSide, Group, Mesh, MeshBasicMaterial, MeshPhongMaterial, Object3D, PlaneBufferGeometry, RingBufferGeometry, Scene } from "three";

/* plains */
const PEP: number = 1; // plain empty
const PH1: number = 2; // plain with house

/* curves */
const CSE: number = 10; // curve south east
const CSW: number = 11; // curve south west
const CNE: number = 12; // curve north east
const CNW: number = 13; // curve north west

/* straights */
const SEW: number = 20; // straight east west
const SNS: number = 21; // straight north south

const MATERIAL_STREET = new MeshBasicMaterial({ color: 0x696969, side: DoubleSide });

/**
 * Ratio of the field width which will not be used by the streets on both side of the street.
 */
const SIDE_RATIO = 0.2;

export class CityBuilder {

    private planSizeX: number = 10;
    private planSizeY: number = 10;
    private plan: number[][] = [
        [CSE, SEW, SEW, SEW, SEW, SEW, SEW, SEW, SEW, CSW],
        [SNS, PH1, PEP, PEP, PEP, PEP, PEP, PEP, PEP, SNS],
        [SNS, PEP, PEP, PEP, PEP, PEP, PEP, PEP, PEP, SNS],
        [SNS, PH1, PEP, PEP, PEP, PH1, PH1, PEP, PEP, SNS],
        [SNS, PEP, PEP, PEP, PEP, PEP, PEP, PEP, PEP, SNS],
        [SNS, PEP, PEP, PEP, PEP, PEP, PEP, PEP, PEP, SNS],
        [SNS, PEP, PEP, PEP, PEP, PH1, PEP, PEP, PEP, SNS],
        [SNS, PEP, PEP, PH1, PEP, PEP, PEP, PEP, PEP, SNS],
        [SNS, PH1, PEP, PEP, PEP, PEP, PH1, PEP, PEP, SNS],
        [CNE, SEW, SEW, SEW, SEW, SEW, SEW, SEW, SEW, CNW]
    ];

    constructor(
        private scene: Scene,
        private fieldWidth: number) { }

    create() {

        for (var j = 0; j < this.planSizeY; j++) {
            let planRow = this.plan[j];
            for (var i = 0; i < this.planSizeX; i++) {

                let posX = (i - this.planSizeX / 2) * this.fieldWidth;
                let posZ = (j - this.planSizeY / 2) * this.fieldWidth;

                let fieldMesh = this.getFieldMesh(planRow[i]);
                fieldMesh.position.set(posX, 0, posZ);
                this.scene.add(fieldMesh);
            }
        }
    }

    getFieldMesh(type: number): Object3D {

        let result = new Group();

        /* define underground */
        let material = new MeshBasicMaterial({ color: 0x1010ff, side: DoubleSide });
        let geometry = new PlaneBufferGeometry(this.fieldWidth, this.fieldWidth);
        let plane = new Mesh(geometry, material);
        plane.rotation.set(Math.PI / 2, 0, 0);
        if (type < 10) {
            material.color = new Color('green');
        } else {
            material.color = new Color('grey');
        }
        result.add(plane);

        if (type == PH1) {
            /* add house */
            let house = this.createHouse();
            result.add(house);

        } else if (type >= 10 && type <= 13) {

            /* add curve */
            let curve = this.createCurve();
            if (type == CSE) {
                curve.rotation.set(0, Math.PI, 0);
            } else if (type == CSW) {
                curve.rotation.set(0, Math.PI / 2, 0);
            } else if (type == CNE) {
                curve.rotation.set(0, 3 * Math.PI / 2, 0);
            }
            result.add(curve);
        } else if (type >= SEW && type <= SNS) {

            /* add straight */
            let straight = this.createStraight();
            if (type == SNS) {
                straight.rotation.set(0, Math.PI / 2, 0);
            }
            result.add(straight);
        }

        return result;
    }

    createHouse(): Object3D {

        let width = this.random(this.fieldWidth / 2, this.fieldWidth);
        let height = this.random(this.fieldWidth, 3 * this.fieldWidth);
        let depth = this.random(this.fieldWidth / 2, this.fieldWidth);

        let geometry = new BoxBufferGeometry(width, height, depth);
        let material = new MeshPhongMaterial({ color: 0xF4A460, side: DoubleSide });
        let mesh = new Mesh(geometry, material);
        mesh.translateY(height/2);
        let result = new Group();
        result.add(mesh);

        return result;
    }

    /**
     * Creates a straight.
     */
    createStraight(): Object3D {

        let result = new Group();

        let geometry = new PlaneBufferGeometry(this.fieldWidth, this.fieldWidth * (1.0 - 2 * SIDE_RATIO));
        let mesh = new Mesh(geometry, MATERIAL_STREET);
        mesh.rotation.set(Math.PI / 2, 0, 0);
        mesh.translateZ(-1);
        result.add(mesh);
        return result;
    }

    /**
     * Creates a curve.
     */
    createCurve(): Object3D {

        let result = new Group();

        let innerRadius = this.fieldWidth * SIDE_RATIO;
        let outerRadius = this.fieldWidth * (1 - SIDE_RATIO);

        let geometry = new RingBufferGeometry(innerRadius, outerRadius, 9, 5, 0.0, Math.PI / 2);
        let mesh = new Mesh(geometry, MATERIAL_STREET);
        mesh.rotation.set(Math.PI / 2, 0, 0);
        mesh.translateX(-this.fieldWidth / 2);
        mesh.translateY(-this.fieldWidth / 2);
        mesh.translateZ(-1);
        result.add(mesh);

        // TODO Begrenzungen an den Seiten, Linien, Bordsteinkante?

        return result;
    }

    /**
     * Returns a random between min and max.
     */
    random(min: number, max: number) {

        return min + Math.random() * (max - min);
    }
}