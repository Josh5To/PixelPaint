const Top = () => {
    return(
    <div className="top">
        <div className="left"></div>
        <div className="center">
            <h1 className="title">
                Pixel Paint
            </h1>

            <p className="description">
                Do you.
            </p>
        </div>
        <div className="right"></div>
        <style jsx>{`

        
        .top {
            font-family: 'LCD Solid';
            order: 1;
            display: flex;
            flex-direction: row;
        }
        .left {
            order: 1;
            width: 50%;
        }
        .center {
            order: 2;
            align-self: center;
            display: flex;
            justify-content: center;
            width: 100%;
            flex-direction: column;
            align-items: center;
        }
        .right {
            order: 3;
            width: 50%;
        }


        .title a {
            color: #0070f3;
            text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
            text-decoration: underline;
        }

        .title {
            font-family: 'LCD Solid';
            margin: 2vh 0px 0px 0px;
            line-height: 1.15;
            font-size: 7vh;
        }

        .description {
            line-height: 1.5;
            font-size: 1.5rem;
        }
        `}
        </style>
    </div>
    );
}
export default Top;