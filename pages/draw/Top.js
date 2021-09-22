const Top = () => {
    return(
    <div>
        <h1 className="title">
            Pixel Paint
        </h1>

        <p className="description">
            Do you.
        </p>

        <style jsx>{`

        
        div {
            font-family: 'LCD Solid';
            order: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
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